import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Logger } from './logger';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private logger = inject(Logger);
  private router = inject(Router);
  private zone = inject(NgZone);

  handleError(error: unknown): void {
    this.logger.error('Unhandled error', error);

    // İstersen burada error page’e yönlendirebilirsin
    // ama loop riskine karşı minimum tutuyoruz:
    // this.zone.run(() => this.router.navigateByUrl('/error'));

    // Angular default handler’ın stack/console çıktısını bozmayalım:
    // (Prod’da zaten minimal logLevel olacak)
    console.error(error);
  }
}
