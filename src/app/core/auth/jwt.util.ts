export interface JwtUser {
  userId: number;
  email?: string;
  roles: string[];
  exp?: number;
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64;

  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export function parseJwt(token: string): any {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return JSON.parse(base64UrlDecode(parts[1]));
}

export function mapJwtUser(token: string): JwtUser {
  const p = parseJwt(token);

  const ROLE_KEYS = [
    'role',
    'roles',
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  ];

  const NAMEID_KEYS = [
    'nameid',
    'sub',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  ];

  const first = (keys: string[]) =>
    keys.find(k => p[k] !== undefined) ? p[keys.find(k => p[k] !== undefined)!] : undefined;

  // ---- ROLES ----
  const rawRoles = first(ROLE_KEYS);
  let roles: string[] = [];

  if (Array.isArray(rawRoles)) {
    roles = rawRoles.map(r => String(r));
  } else if (typeof rawRoles === 'string') {
    roles = [rawRoles];
  }

  // ---- USER ID ----
  const userIdRaw = first(NAMEID_KEYS);

  return {
    userId: Number(userIdRaw ?? 0),
    email: p['email'],
    roles,
    exp: p['exp'],
  };
}


export function isExpired(token: string, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
  const p = parseJwt(token);
  const exp = Number(p['exp'] ?? 0);
  return exp > 0 ? nowSeconds >= exp : false;
}
