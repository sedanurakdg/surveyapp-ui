export function assert(condition: unknown, message = 'Assertion failed'): asserts condition {
  if (!condition) throw new Error(message);
}

export function isDefined<T>(v: T | null | undefined): v is T {
  return v !== null && v !== undefined;
}

export function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

export function unreachable(x: never, msg = 'Unreachable code'): never {
  throw new Error(`${msg}: ${String(x)}`);
}
