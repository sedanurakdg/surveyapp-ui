import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';
const ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40, none: 999 };

@Injectable({ providedIn: 'root' })
export class Logger {
  private readonly level: LogLevel = environment.logLevel;

  debug(message: string, meta?: unknown) {
    if (ORDER[this.level] <= ORDER.debug) console.debug(`[DEBUG] ${message}`, meta ?? '');
  }

  info(message: string, meta?: unknown) {
    if (ORDER[this.level] <= ORDER.info) console.info(`[INFO] ${message}`, meta ?? '');
  }

  warn(message: string, meta?: unknown) {
    if (ORDER[this.level] <= ORDER.warn) console.warn(`[WARN] ${message}`, meta ?? '');
  }

  error(message: string, meta?: unknown) {
    if (ORDER[this.level] <= ORDER.error) console.error(`[ERROR] ${message}`, meta ?? '');
  }
}
