// ─────────────────────────────────────────────────────────────
// IN THE MARGIN · Netlify Function
// gumroad-webhook.js
//
// Gumroad pings this URL every time someone makes a purchase.
// Automatically adds their license key to Supabase.
//
// Set this URL in Gumroad → Settings → Advanced → Ping:
// https://in-the-margin.netlify.app/.netlify/functions/gumroad-webhook
// ─────────────────────────────────────────────────────────────

const SUPABASE_URL         = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const WEBHOOK_SECRET       = process.env.GUMROAD_WEBHOOK_SECRET; // optional extra security

// Maps Gumroad product variant names to unit arrays
// Update these if you rename your Gumroad versions
const PRODUCT_UNIT_MAP = {
  'wuthering heights · home study':    ['wh'],
  'macbeth · home study':              ['macbeth'],
  'series 1 complete · home study':    ['macbeth', 'wh'],
  'series 1 · teacher license':        ['macbeth', 'wh'],
  // Fallback — if variant name doesn't match, unlock both
  'default':                           ['macbeth', 'wh'],
};

function getUnitsForProduct(variantName, productName) {
  if (variantName) {
    const key = variantName.toLowerCase().trim();
    if (PRODUCT_UNIT_MAP[key]) return PRODUCT_UNIT_MAP[key];
  }
  if (productName) {
    const key = productName.toLowerCase().trim();
    if (PRODUCT_UNIT_MAP[key]) return PRODUCT_UNIT_MAP[key];
  }
  return PRODUCT_UNIT_MAP['default'];
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  // Parse Gumroad's form-encoded ping
  let params;
  try {
    params = Object.fromEntries(new URLSearchParams(event.body));
  } catch {
    return { statusCode: 400, body: 'Invalid body' };
  }

  // Gumroad sends: sale_id, product_name, variants, license_key, email, etc.
  const {
    sale_id,
    product_name,
    variants,          // e.g. "Tier: Wuthering Heights · Home Study"
    license_key,
    email,
    refunded,
    chargebacked,
  } = params;

  // Ignore refunds and chargebacks
  if (refunded === 'true' || chargebacked === 'true') {
    // Optionally revoke the code
    if (license_key) {
      await fetch(
        `${SUPABASE_URL}/rest/v1/license_codes?code=eq.${encodeURIComponent(license_key)}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ revoked: true, revoked_at: new Date().toISOString() }),
        }
      );
    }
    return { statusCode: 200, body: 'Refund processed' };
  }

  if (!license_key) {
    return { statusCode: 400, body: 'No license key in ping' };
  }

  // Parse variant name from Gumroad's "Tier: ..." format
  let variantName = '';
  if (variants) {
    const match = variants.match(/Tier:\s*(.+)/i);
    if (match) variantName = match[1].trim();
  }

  const units = getUnitsForProduct(variantName, product_name);

  try {
    // Insert into Supabase — ignore if already exists (duplicate ping)
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/license_codes`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=ignore-duplicates,return=minimal',
        },
        body: JSON.stringify({
          code:            license_key,
          email:           email || '',
          product_name:    variantName || product_name || '',
          units:           units,
          access_type:     'purchase',
          gumroad_sale_id: sale_id || '',
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('Supabase insert error:', err);
      return { statusCode: 500, body: 'Database error' };
    }

    console.log(`License added: ${license_key} → units: ${units.join(', ')} (${email})`);
    return { statusCode: 200, body: 'OK' };

  } catch (err) {
    console.error('gumroad-webhook error:', err);
    return { statusCode: 500, body: 'Server error' };
  }
};
