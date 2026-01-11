export function toDate(value: string | number | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

export function isValidDate(d: Date): boolean {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

export function formatIsoDateTime(d: Date): string {
  // ISO string without milliseconds for readability
  const iso = d.toISOString();
  return iso.replace(/\.\d{3}Z$/, 'Z');
}

export function isBetweenUtc(nowUtc: Date, startUtc: Date, endUtc: Date): boolean {
  const n = nowUtc.getTime();
  return n >= startUtc.getTime() && n <= endUtc.getTime();
}
