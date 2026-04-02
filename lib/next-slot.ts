/** Next 30-minute boundary from now (ms resolution). */
export function nextThirtyMinuteStartsAt(d = new Date()): Date {
  const slotMs = 30 * 60 * 1000;
  const t = d.getTime();
  return new Date(Math.ceil(t / slotMs) * slotMs);
}
