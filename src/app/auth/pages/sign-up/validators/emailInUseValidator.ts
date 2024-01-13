import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const emailInUseValidator =
  (emailArr: Array<string>): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null =>
    emailArr.includes(control.value)
      ? { emailInUseValidator: 'Email is already in use.' }
      : null;
