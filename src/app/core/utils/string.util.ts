export function safeTrim(v: string | null | undefined): string {
  return (v ?? '').trim();
}

export function toTitleCase(s: string): string {
  const t = safeTrim(s).toLowerCase();
  if (!t) return '';
  return t.replace(/\b\p{L}/gu, (m) => m.toUpperCase());
}

export function equalsIgnoreCase(a?: string | null, b?: string | null): boolean {
  return safeTrim(a).toLowerCase() === safeTrim(b).toLowerCase();
}

export function clampString(s: string, maxLen: number): string {
  if (maxLen <= 0) return '';
  return s.length > maxLen ? `${s.slice(0, maxLen - 1)}…` : s;
}
