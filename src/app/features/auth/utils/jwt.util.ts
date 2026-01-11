export type JwtClaims = Record<string, any>;

export function decodeJwt(token: string): JwtClaims | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // base64 padding
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);

    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getRolesFromClaims(claims: JwtClaims | null): string[] {
  if (!claims) return [];

  // ASP.NET Core tarafında role claim'i farklı gelebilir:
  // "role" veya "roles" veya "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
  const candidates = [
    claims['role'],
    claims['roles'],
    claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
  ];

  const raw = candidates.find(v => v != null);

  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string') return [raw];

  return [];
}
