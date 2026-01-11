export function distinctBy<T, K>(items: readonly T[], key: (x: T) => K): T[] {
  const seen = new Set<K>();
  const out: T[] = [];
  for (const it of items) {
    const k = key(it);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(it);
  }
  return out;
}

export function sortBy<T>(items: readonly T[], cmp: (a: T, b: T) => number): T[] {
  return [...items].sort(cmp);
}
