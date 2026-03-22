// ─────────────────────────────────────────────────────────────
// IN THE MARGIN · Netlify Function
// validate-license.js
//
// Called by auth.js when a student enters a code.
// Validates against Supabase, logs the device, returns units.
//
// POST body: { code, deviceId, userAgent }
// ─────────────────────────────────────────────────────────────

const SUPABASE_URL        = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, body: 'Invalid JSON' }; }

  const { code, deviceId, userAgent } = body;

  if (!code) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, error: 'No code provided' }),
    };
  }

  try {
    // ── Look up the code in Supabase ──────────────────────────
    const lookupRes = await fetch(
      `${SUPABASE_URL}/rest/v1/license_codes?code=eq.${encodeURIComponent(code.trim())}&select=*`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const rows = await lookupRes.json();

    if (!rows || rows.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, error: 'Code not found' }),
      };
    }

    const license = rows[0];

    if (license.revoked) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, error: 'Code has been revoked' }),
      };
    }

    // ── Log this device login ─────────────────────────────────
    if (deviceId) {
      await fetch(
        `${SUPABASE_URL}/rest/v1/device_logins`,
        {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            code: license.code,
            device_id: deviceId,
            user_agent: userAgent || '',
            units: license.units,
          }),
        }
      );
    }

    // ── Return success ────────────────────────────────────────
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        units: license.units,
        accessType: license.access_type,
        productName: license.product_name,
      }),
    };

  } catch (err) {
    console.error('validate-license error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Server error' }),
    };
  }
};
