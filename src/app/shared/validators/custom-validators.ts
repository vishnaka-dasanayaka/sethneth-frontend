import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
  static phoneFormat(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const phoneRegex = /^0\d{9}$/; // 10 digits, starting with 0
    if (!value) return null;
    return phoneRegex.test(value) ? null : { invalidPhone: true };
  }

  static strictEmail(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    if (!value) return null;
    return emailRegex.test(value) ? null : { invalidEmailFormat: true };
  }
}
