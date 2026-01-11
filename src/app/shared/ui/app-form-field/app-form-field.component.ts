import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

type FieldType = 'text' | 'password' | 'email' | 'number';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './app-form-field.component.html',
  styleUrls: ['./app-form-field.component.scss'],
})
export class AppFormFieldComponent {
  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) label!: string;

  @Input() placeholder = '';
  @Input() type: FieldType = 'text';
  @Input() autocomplete: string | null = null;
  @Input() hint?: string;
  @Input() appearance: 'fill' | 'outline' = 'outline';

  @Input() requiredMsg = 'Bu alan zorunludur.';
  @Input() emailMsg = 'Geçerli bir e-posta giriniz.';

  hide = true;

  get showError(): boolean {
    return this.control.invalid && (this.control.touched || this.control.dirty);
  }

  get errorText(): string {
    if (!this.control.errors) return '';
    if (this.control.hasError('required')) return this.requiredMsg;
    if (this.control.hasError('email')) return this.emailMsg;

    const firstKey = Object.keys(this.control.errors)[0];
    return `Geçersiz değer (${firstKey}).`;
  }

  get inputType(): string {
    if (this.type !== 'password') return this.type;
    return this.hide ? 'password' : 'text';
  }

  togglePassword() {
    if (this.type === 'password') this.hide = !this.hide;
  }
}
