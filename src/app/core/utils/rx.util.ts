import { Observable, finalize } from 'rxjs';

export function withLoading<T>(setLoading: (v: boolean) => void) {
  return (source$: Observable<T>) => {
    setLoading(true);
    return source$.pipe(finalize(() => setLoading(false)));
  };
}
