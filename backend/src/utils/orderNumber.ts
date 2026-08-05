/** Generates a short, human-friendly, sufficiently-unique order number, e.g. "FRK-7X2K9A". */
export function generateOrderNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid ambiguity
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `FRK-${suffix}`;
}
