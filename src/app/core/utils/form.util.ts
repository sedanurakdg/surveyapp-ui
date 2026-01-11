import { AbstractControl, FormGroup } from '@angular/forms';

export function markAllTouched(ctrl: AbstractControl): void {
  if (ctrl instanceof FormGroup) {
    Object.values(ctrl.controls).forEach(markAllTouched);
  }
  ctrl.markAsTouched();
  ctrl.updateValueAndValidity({ onlySelf: true });
}

export function hasError(ctrl: AbstractControl | null | undefined, error: string): boolean {
  return !!ctrl && ctrl.touched && ctrl.hasError(error);
}
