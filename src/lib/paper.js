// Shared deterministic helpers for the paper design system.

function hash(str) {
  let h = 2166136261;
  const s = String(str ?? "");
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Deterministic tilt in degrees, stable for a given id. */
export function tiltFor(id, range = 1.5) {
  const steps = 7;
  const step = (hash(id) % steps) / (steps - 1); // 0..1
  return Number((step * 2 * range - range).toFixed(2));
}

/** Deterministic 0..1 value for subtle offsets. */
export function jitterFor(id, salt = "") {
  return (hash(id + "|" + salt) % 100) / 100;
}

export const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n) || 0);

export const shortDate = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
};

export const timeAgo = (iso) => {
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return "—";
  const mins = Math.round((Date.now() - d) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days} d ago`;
  return shortDate(iso);
};

/** Mock async delay so interactions feel like real work is happening. */
export const wait = (ms = 650) => new Promise((r) => setTimeout(r, ms));

export const LOW_STOCK = 5;
