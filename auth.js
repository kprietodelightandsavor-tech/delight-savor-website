// ─────────────────────────────────────────────────────────────
// IN THE MARGIN · Auth v2
// Server-validated via Netlify function + Supabase
// ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'margin_auth_v2';

// Generate a stable device ID for this browser
function getDeviceId() {
  let id = localStorage.getItem('margin_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('margin_device_id', id);
  }
  return id;
}

function getAuthState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function saveAuthState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Returns array of unit ids this device has access to
function getUnlockedUnits() {
  const state = getAuthState();
  if (!state.units || !state.validatedAt) return [];
  // Co-op access expires after 120 days
  if (state.accessType === 'coop') {
    const age = Date.now() - state.validatedAt;
    if (age > 120 * 24 * 60 * 60 * 1000) return [];
  }
  return state.units || [];
}

// Returns true if this device can access the given unit id
function canAccessUnit(unitId) {
  return getUnlockedUnits().includes(unitId);
}

// Redirect to locked page if no access
function requireAccess(unitId) {
  if (!canAccessUnit(unitId)) {
    const returnUrl = encodeURIComponent(window.location.pathname);
    window.location.href = '/locked.html?unit=' + unitId + '&return=' + returnUrl;
  }
}

// Called by locked.html — validates code via Netlify function
async function tryUnlock(input) {
  const code = input.trim();
  if (!code) return { success: false, error: 'Please enter a code.' };

  try {
    const res = await fetch('/.netlify/functions/validate-license', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        deviceId:  getDeviceId(),
        userAgent: navigator.userAgent,
      }),
    });

    const data = await res.json();

    if (data.success) {
      saveAuthState({
        units:       data.units,
        accessType:  data.accessType,
        productName: data.productName,
        validatedAt: Date.now(),
      });
      return { success: true, units: data.units, label: data.productName };
    }

    return { success: false, error: data.error || 'Code not recognised.' };

  } catch (err) {
    // If network fails, fall back to cached state
    const cached = getAuthState();
    if (cached.units && cached.units.length > 0) {
      return { success: true, units: cached.units, label: cached.productName, fromCache: true };
    }
    return { success: false, error: 'Could not connect. Check your internet and try again.' };
  }
}

// Sign out
function signOut() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = '/locked.html';
}
