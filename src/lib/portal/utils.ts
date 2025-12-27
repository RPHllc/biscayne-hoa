export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeAddress(houseNumber: string, street: string) {
  const trimmedHouse = houseNumber.trim();
  const trimmedStreet = street.trim();
  return {
    houseNumber: trimmedHouse,
    street: trimmedStreet,
    address: `${trimmedHouse} ${trimmedStreet}`.trim(),
  };
}

export function isResidentCurrent(lastPaidAt: string | null, now = new Date()) {
  if (!lastPaidAt) return false;
  const lastPaid = new Date(lastPaidAt);
  if (Number.isNaN(lastPaid.getTime())) return false;

  const paidYear = lastPaid.getUTCFullYear();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth(); // 0-based

  if (paidYear >= currentYear) return true;
  if (currentMonth <= 2 && paidYear === currentYear - 1) return true;
  return false;
}

export function formatUtcIso(date = new Date()) {
  return date.toISOString();
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((value) => {
    binary += String.fromCharCode(value);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function generateToken(bytes = 32) {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return toBase64Url(buffer);
}

export async function hashToken(token: string) {
  const data = new TextEncoder().encode(token);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
