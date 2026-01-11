export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface Endpoint<TRes, TReq = never> {
  method: HttpMethod;
  path: string;
}

export function endpoint<TRes, TReq = never>(method: HttpMethod, path: string): Endpoint<TRes, TReq> {
  return { method, path };
}
