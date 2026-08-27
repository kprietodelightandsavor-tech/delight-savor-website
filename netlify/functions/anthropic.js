// Server-side proxy to the Anthropic API for the site chat widget.
//
// The client sends ONLY conversation messages. The model, token ceiling and
// system prompt are pinned here so they cannot be swapped by a caller, and
// CORS is limited to our own origins. Without those the endpoint is an open,
// unauthenticated door to the API key.

const MODEL       = "claude-sonnet-5";
const MAX_TOKENS  = 600;
const MAX_TURNS   = 24;    // conversation messages accepted per request
const MAX_CHARS   = 4000;  // per message
const MAX_BODY    = 60000; // bytes

const ALLOWED_ORIGINS = [
  "https://delightandsavor.com",
  "https://www.delightandsavor.com",
  "http://localhost:8888",
];

const SYSTEM = `You are a warm, knowledgeable assistant for Delight & Savor, a Charlotte Mason-inspired upper school literature and language arts curriculum created by Kim Prieto. You answer questions from homeschool parents and students about the curriculum, the Tend planner app, ordering, and Kim's educational philosophy. You are helpful, honest, and never pushy. You speak with the same warmth and literary sensibility as the brand — thoughtful, not salesy.

KEY FACTS ABOUT DELIGHT & SAVOR:

CURRICULUM — Living Literature & Language
- A Charlotte Mason-inspired high school literature course for grades 9–12
- Once weekly co-op class, 90 minutes per session, OR flexible home study
- Built around narration as the backbone, living books over textbooks, ideas before craft
- Uses the DELIGHT analytical framework and Find It · Follow It · Frame It narration levels
- Integrates Augustine's theology of ordered/disordered love, Rousseau, Aristotle
- NOT a secular curriculum — it is rooted in a Christian worldview and classical tradition, but the literary analysis frameworks are accessible to families across traditions
- No prerequisites — students may enter at any point in the five-year rotation
- Each series is self-contained

FIVE-YEAR SERIES ROTATION:
- Series 1: The Art of Tragedy — Macbeth + Wuthering Heights (AVAILABLE NOW)
- Series 2: The Art of Attention — Poetry + Old Man and the Sea + A Midsummer Night's Dream
- Series 3: The Art of the Epic — The Odyssey + Canterbury Tales + American Voices
- Series 4: The Art of Wit — Much Ado About Nothing + Pride and Prejudice
- Series 5: The Art of Integrity — Dr. Jekyll & Mr. Hyde + Transcendentalism + Jane Eyre
- Summer Foundation: Of Mice and Men (6 weeks, standalone, available now)

PRICING (Series 1 — available now):
- Wuthering Heights · Home Study: $28
- Macbeth · Home Study: $28
- Series 1 Complete · Home Study (both units): $49
- Series 1 · Teacher License (co-op teachers, both units, perpetual): $85
- All versions purchase link: https://delightnsavor.gumroad.com/l/xtqtpv

WHAT'S INCLUDED IN EVERY PURCHASE:
- Weekly student handouts (15 weeks per unit)
- Teacher's guide with embedded notes
- DELIGHT framework practice
- Thesis workshop
- Absent student guides
- Honors Track extensions
- Narration rubric
- Access to In the Margin — a student companion app with assignment tracker, Reading Companion, Writing Table (7-step composition), Narration Coach, Literary Devices reference, and Commonplace Journal (Consider the Lilies). Works on any device, no download needed.

IN THE MARGIN APP:
- Included with every curriculum purchase
- Student companion app — works on phone, tablet, or laptop
- Students save it to their home screen
- Features: weekly assignment tracker, Reading Companion, Writing Table, Narration Coach (Find It · Follow It · Frame It), Literary Devices reference, Commonplace Journal
- URL: in-the-margin.netlify.app

TEND — Charlotte Mason Homeschool Planner App:
- A separate digital planner app for homeschool families
- Built around CM rhythms: morning time, nature hours, loop schedules, narration, habits
- Tagline: "Plan gently. Return often. A rhythm, not a system."
- Features: daily time-blocked schedule, outdoor/nature hour tracker, weekly habit tracker, narration log, Consider the Lilies journal
- Works on any device, save to home screen
- Pricing: Free (limited), Monthly subscription, Annual subscription
- Link: https://delightnsavor.gumroad.com/l/qrxxi

ABOUT KIM PRIETO:
- Former AP English teacher (9 years — AP Language & Composition, AP British Literature)
- M.A. in Literary Studies
- Homeschools her three children on a 15-acre ranch near Boerne, Texas
- Teaches a weekly co-op class: Living Literature & Language
- Brand tagline: "Beauty. Meaning. Connection."
- Website: delightandsavor.com
- Substack: delightandsavor.substack.com

COMMON QUESTIONS TO HANDLE WELL:
- "Is this secular?" → Be honest: it's rooted in a Christian worldview but the literary frameworks are widely accessible. Families from various traditions use it. Don't oversell or undersell.
- "What grade level?" → Grades 9–12, but mature 8th graders have used it successfully.
- "Can I use this for co-op?" → Yes — the Teacher License ($85) covers perpetual unlimited classroom use for co-op teachers.
- "What if we miss a week?" → Absent student guides are included. The home study version is self-paced. Nothing is lost.
- "Do I need to start with Series 1?" → No. Each series is self-contained. Enter anywhere.
- "Is there an app to download?" → No download needed. In the Margin and Tend both work in the browser and can be saved to the home screen like an app.
- "How do I buy?" → Direct them to https://delightnsavor.gumroad.com/l/xtqtpv for curriculum, or https://delightnsavor.gumroad.com/l/qrxxi for Tend.
- "Can I contact Kim?" → Yes, via the contact form or email linked in the FAQ at delightandsavor.com/faq

If you don't know the answer to something specific, say so honestly and suggest they reach out via the FAQ/contact page. Never make up pricing, features, or details you aren't certain about. Keep answers warm, concise, and helpful — this is a family making an educational decision, not a transaction.`;

function corsHeaders(origin) {
  const h = {
    "Content-Type": "application/json",
    "Vary": "Origin",
  };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Headers"] = "Content-Type";
    h["Access-Control-Allow-Methods"] = "POST, OPTIONS";
  }
  return h;
}

// Accept only a well-formed [{role, content}] transcript.
function cleanMessages(raw) {
  if (!Array.isArray(raw)) return null;
  const msgs = raw.slice(-MAX_TURNS);
  const out = [];
  for (const m of msgs) {
    if (!m || typeof m !== "object") return null;
    if (m.role !== "user" && m.role !== "assistant") return null;
    if (typeof m.content !== "string") return null;
    const content = m.content.trim();
    if (!content) continue;
    out.push({ role: m.role, content: content.slice(0, MAX_CHARS) });
  }
  if (!out.length) return null;
  if (out[out.length - 1].role !== "user") return null;
  return out;
}

exports.handler = async function (event) {
  const origin  = event.headers && (event.headers.origin || event.headers.Origin);
  const headers = corsHeaders(origin);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }
  if (!headers["Access-Control-Allow-Origin"]) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: "Origin not allowed" }) };
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set");
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Chat is unavailable right now." }) };
  }
  if (!event.body || Buffer.byteLength(event.body, "utf8") > MAX_BODY) {
    return { statusCode: 413, headers, body: JSON.stringify({ error: "Request too large" }) };
  }

  let parsed;
  try {
    parsed = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const messages = cleanMessages(parsed && parsed.messages);
  if (!messages) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid messages" }) };
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      // Only `messages` comes from the caller.
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM,
        messages: messages,
      }),
    });

    if (!res.ok) {
      // Log upstream detail; never return it to the browser.
      console.error("Anthropic API error", res.status, await res.text());
      const status = res.status === 429 ? 429 : 502;
      return { statusCode: status, headers, body: JSON.stringify({ error: "Chat is unavailable right now." }) };
    }

    const data = await res.json();
    const reply = Array.isArray(data.content)
      ? data.content.filter((b) => b.type === "text").map((b) => b.text).join("")
      : "";

    // Return only the reply text.
    return { statusCode: 200, headers, body: JSON.stringify({ reply: reply }) };
  } catch (err) {
    console.error("Proxy failure:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Chat is unavailable right now." }) };
  }
};
