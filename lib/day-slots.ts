/** Business day slot starts: 09:00–17:30 UTC in 30-minute steps (last slot ends 18:00). */
const DAY_START_MIN = 9 * 60;
const DAY_END_MIN = 18 * 60;

export function parseYmd(ymd: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0, 0));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) {
    return null;
  }
  return { y, m, d };
}

/** Slot start times for the calendar day in UTC (09:00 … 17:30). */
export function slotStartsUtcForDay(y: number, m: number, d: number): Date[] {
  const slots: Date[] = [];
  for (let minutes = DAY_START_MIN; minutes < DAY_END_MIN; minutes += 30) {
    const h = Math.floor(minutes / 60);
    const min = minutes % 60;
    slots.push(new Date(Date.UTC(y, m - 1, d, h, min, 0, 0)));
  }
  return slots;
}

export function dayBoundsUtc(y: number, m: number, d: number): { start: Date; end: Date } {
  const start = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
  const end = new Date(Date.UTC(y, m - 1, d + 1, 0, 0, 0, 0));
  return { start, end };
}
