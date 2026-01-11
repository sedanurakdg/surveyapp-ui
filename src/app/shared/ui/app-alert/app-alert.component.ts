import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './app-alert.component.html',
  styleUrls: ['./app-alert.component.scss'],
})
export class AppAlertComponent {
  @Input() variant: AlertVariant = 'info';
  @Input() title?: string;
  @Input({ required: true }) message!: string;

  @Input() closable = false;
  @Output() closed = new EventEmitter<void>();

  get icon(): string {
    switch (this.variant) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
    }
  }

  close() { this.closed.emit(); }
}
