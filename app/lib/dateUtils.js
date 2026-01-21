export function normalizeDate(dateStr) {
  return new Date(dateStr).toISOString().slice(0, 10);
}

export function shiftDate(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
