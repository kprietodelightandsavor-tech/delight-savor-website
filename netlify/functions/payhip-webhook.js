// ─────────────────────────────────────────────────────────────
// DELIGHT & SAVOR · Netlify Function
// payhip-webhook.js
//
// Payhip pings this URL on sale, refund and subscription events.
// Grants or revokes access in Supabase.
//
// Set up in Payhip → Settings → Developer:
//   Webhook URL: https://delightandsavor.com/.netlify/functions/payhip-webhook
//   Events:      paid, refunded, subscription.created, subscription.deleted
//
// Env vars required:
//   PAYHIP_API_KEY        Settings → Developer (used to verify the signature)
//   SUPABASE_URL
//   SUPABASE_SERVICE_KEY
// ─────────────────────────────────────────────────────────────

const crypto = require('crypto');

const SUPABASE_URL         = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const PAYHIP_API_KEY       = process.env.PAYHIP_API_KEY;

// Map Payhip product / variant names to the units they unlock.
// Names are lowercased and trimmed before lookup.
// Unit codes must match what the app gates on: 'macbeth', 'wh', 'omam'.
const ALL_UNITS = ['macbeth', 'wh', 'omam'];

const PRODUCT_UNIT_MAP = {
  // Memberships — create these in Payhip with names that match.
  'all access':                                          ALL_UNITS,
  'all access membership':                               ALL_UNITS,
  'all access · monthly':                                ALL_UNITS,
  'all access · annual':                                 ALL_UNITS,

  // Live products, exactly as they are named in the Payhip store.
  'summer foundations: of mice and men':                 ['omam'],
  'summer foundations · co-op license — of mice and men': ['omam'],

  // Sold, but grant no in-app course access (printables / other apps).
  'ds find it, follow it, frame it':                     [],
  'living rhythm planer- pro access':                    [],

  // Not yet launched — names are provisional, correct them at launch.
  'macbeth':                                             ['macbeth'],
  'wuthering heights':                                   ['wh'],
};

// Unknown product: grant nothing, but still record the sale loudly so a
// mis-named product surfaces instead of silently over- or under-granting.
function unitsFor(variantName, productName) {
  for (const n of [variantName, productName]) {
    if (!n) continue;
    const hit = PRODUCT_UNIT_MAP[String(n).toLowerCase().trim()];
    if (hit) return hit;
  }
  console.error('NO UNIT MAPPING — add to PRODUCT_UNIT_MAP:',
    JSON.stringify({ productName, variantName }));
  return [];
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a || ''));
  const bb = Buffer.from(String(b || ''));
  if (ab.length !== bb.length || ab.length === 0) return false;
  return crypto.timingSafeEqual(ab, bb);
}

// Payhip signs the payload with sha256 of the account API key.
function signatureOk(payload) {
  const expected = crypto.createHash('sha256').update(PAYHIP_API_KEY).digest('hex');
  return safeEqual(payload && payload.signature, expected);
}

// Payhip does not always send a license key (subscriptions in particular).
// Use one when present; otherwise derive a stable code we can re-issue.
function accessCode(payload, item) {
  const given = (item && (item.license_key || item.key)) || payload.license_key;
  if (given && String(given).length >= 6) return String(given);
  const seed = [payload.email, (item && item.product_id) || '', payload.id || payload.transaction_id || ''].join('|');
  return 'PH-' + crypto.createHash('sha256').update(seed).digest('hex').slice(0, 20).toUpperCase();
}

const sbHeaders = (extra) => Object.assign({
  'apikey': SUPABASE_SERVICE_KEY,
  'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  'Content-Type': 'application/json',
}, extra || {});

async function grant({ code, email, productName, units, accessType }) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/license_codes`, {
    method: 'POST',
    headers: sbHeaders({ 'Prefer': 'resolution=merge-duplicates,return=minimal' }),
    body: JSON.stringify({
      code,
      email: email || '',
      product_name: productName || '',
      units,
      access_type: accessType,
      revoked: false,
      revoked_at: null,
    }),
  });
  if (!res.ok) throw new Error(`Supabase insert failed: ${res.status} ${await res.text()}`);
}

async function revoke(code) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/license_codes?code=eq.${encodeURIComponent(code)}`,
    {
      method: 'PATCH',
      headers: sbHeaders(),
      body: JSON.stringify({ revoked: true, revoked_at: new Date().toISOString() }),
    }
  );
  if (!res.ok) throw new Error(`Supabase revoke failed: ${res.status} ${await res.text()}`);
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  // Fail closed rather than accept unverifiable pings.
  if (!PAYHIP_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('payhip-webhook is missing required env vars');
    return { statusCode: 503, body: 'Not configured' };
  }

  let payload;
  try {
    // Payhip posts JSON; tolerate form-encoded just in case.
    payload = event.body.trim().startsWith('{')
      ? JSON.parse(event.body)
      : Object.fromEntries(new URLSearchParams(event.body));
  } catch {
    return { statusCode: 400, body: 'Invalid body' };
  }

  if (!signatureOk(payload)) {
    console.warn('Rejected payhip ping: bad signature');
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const type  = payload.type || payload.event || 'paid';
  const email = payload.email || payload.buyer_email || '';
  const items = Array.isArray(payload.items) && payload.items.length
    ? payload.items
    : [{ product_name: payload.product_name, variant_name: payload.variant_name }];

  try {
    // ── Revocations ────────────────────────────────────────────
    if (type === 'refunded' || type === 'subscription.deleted') {
      for (const item of items) {
        await revoke(accessCode(payload, item));
      }
      console.log(`Revoked access for ${email} (${type})`);
      return { statusCode: 200, body: 'OK' };
    }

    // ── Grants ─────────────────────────────────────────────────
    if (type === 'paid' || type === 'subscription.created') {
      const accessType = type === 'subscription.created' ? 'subscription' : 'purchase';
      for (const item of items) {
        const productName = item.product_name || item.name || payload.product_name || '';
        const variantName = item.variant_name || payload.variant_name || '';
        const code = accessCode(payload, item);
        await grant({
          code,
          email,
          productName: variantName || productName,
          units: unitsFor(variantName, productName),
          accessType,
        });
        console.log(`Access granted: ${code} → ${unitsFor(variantName, productName).join(', ')} (${email}, ${accessType})`);
      }
      return { statusCode: 200, body: 'OK' };
    }

    console.log('Ignoring unhandled Payhip event:', type);
    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('payhip-webhook error:', err);
    // Non-2xx makes Payhip retry hourly for up to 3 hours.
    return { statusCode: 500, body: 'Server error' };
  }
};
