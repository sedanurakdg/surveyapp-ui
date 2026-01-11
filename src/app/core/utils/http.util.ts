import { HttpErrorResponse } from '@angular/common/http';

export function getHttpErrorMessage(err: unknown, fallback = 'İşlem sırasında hata oluştu.'): string {
  if (!(err instanceof HttpErrorResponse)) return fallback;

  const body: any = err.error;

  // backend bazen { message: "..." } dönüyor
  if (body && typeof body === 'object' && typeof body.message === 'string') return body.message;

  // bazen string dönüyor
  if (typeof body === 'string' && body.trim()) return body;

  // default
  return err.message || fallback;
}
