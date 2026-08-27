const https = require("https");

exports.handler = async (event) => {
  const ALLOWED_ORIGINS = [
    "https://delightandsavor.com",
    "https://www.delightandsavor.com",
    "http://localhost:8888",
  ];
  const origin = event.headers && (event.headers.origin || event.headers.Origin);
  const headers = {
    "Content-Type": "application/json",
    "Vary": "Origin",
  };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
  }

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    if (!headers["Access-Control-Allow-Origin"]) {
      return { statusCode: 403, headers, body: JSON.stringify({ error: "Origin not allowed" }) };
    }

    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt || typeof prompt !== "string") {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "No prompt provided" }) };
    }
    // Cap the client-supplied prompt; this endpoint spends API credit.
    const MAX_PROMPT = 8000;
    if (prompt.length > MAX_PROMPT) {
      return { statusCode: 413, headers, body: JSON.stringify({ error: "Prompt too long" }) };
    }

    const requestBody = JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 4000,
      system: `You are a warm, experienced Charlotte Mason homeschool planning guide writing for Delight & Savor (delightandsavor.com). Your voice is like a knowledgeable friend: specific, honest, encouraging, never preachy. You synthesize wisdom from A Gentle Feast, Simply Charlotte Mason, A Delectable Education, and Read Aloud Revival — but you help families find THEIR rhythm, not a borrowed one.

You will respond with a JSON object containing exactly these keys:
{
  "weeklyRhythm": { "title": "...", "body": "...", "note": "..." },
  "dailyRhythm": { "title": "...", "body": "...", "note": "..." },
  "morningTime": { "title": "...", "body": "...", "note": "..." },
  "loopPlan": { "title": "...", "body": "...", "note": "..." },
  "outdoorNature": { "title": "...", "body": "...", "note": "..." },
  "termStructure": { "title": "...", "body": "...", "note": "..." },
  "readAloud": { "title": "...", "body": "...", "note": "..." },
  "encouragement": { "title": "...", "body": "...", "note": "..." }
}

Each "body" should be 3–5 sentences of specific, practical guidance written in warm prose — not bullet points. Each "note" should be one sentence of honest, gentle coaching. Reference the family's specific answers. Use their name. Speak to their actual struggles. The rhythm should feel like it was made for this exact family.

Return ONLY valid JSON. No markdown, no backticks, no preamble.`,
      messages: [{ role: "user", content: prompt }],
    });

    // Call Anthropic API server-side
    const result = await new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: "api.anthropic.com",
          path: "/v1/messages",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "Content-Length": Buffer.byteLength(requestBody),
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => { data += chunk; });
          res.on("end", () => {
            try { resolve(JSON.parse(data)); }
            catch (e) { reject(new Error("Failed to parse Anthropic response")); }
          });
        }
      );
      req.on("error", reject);
      req.write(requestBody);
      req.end();
    });

    const text = result.content?.[0]?.text || "{}";
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result: text }),
    };

  } catch (e) {
    console.error("Rhythm builder error:", e);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
