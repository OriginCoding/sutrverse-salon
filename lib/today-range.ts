/** Start of local calendar day (00:00:00.000). */
export function startOfDay(d = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Start of the next local calendar day (exclusive upper bound for "today"). */
export function startOfNextDay(d = new Date()): Date {
  const x = startOfDay(d);
  x.setDate(x.getDate() + 1);
  return x;
}
