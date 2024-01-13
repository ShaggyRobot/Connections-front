import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password: string = control.value;

    if (!password) return null;

    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#?]/.test(password);

    const errors = [];

    if (!hasMinLength) errors.push('At least 8 chars long.');
    if (!hasUpperCase) errors.push('At least one uppercase letter.');
    if (!hasDigit) errors.push('At least one digit.');
    if (!hasSpecialChar) errors.push('Atleast one of !, @, #, ?.');

    if (errors.length) return { passwordValidator: errors };

    return null;
  };
}
