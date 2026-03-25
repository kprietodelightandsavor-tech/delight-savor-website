const https = require("https");

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "No prompt provided" }) };
    }

    const requestBody = JSON.stringify({
      model: "claude-sonnet-4-20250514",
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
