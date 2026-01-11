export function pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) out[k] = obj[k];
  return out;
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
  const out: any = { ...obj };
  for (const k of keys) delete out[k];
  return out;
}

export function deepFreeze<T>(obj: T): Readonly<T> {
  if (obj && typeof obj === 'object') {
    Object.freeze(obj);
    for (const key of Object.getOwnPropertyNames(obj)) {
      // @ts-expect-error index access
      const val = obj[key];
      if (val && typeof val === 'object' && !Object.isFrozen(val)) deepFreeze(val);
    }
  }
  return obj as Readonly<T>;
}
