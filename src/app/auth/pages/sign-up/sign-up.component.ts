import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit/tokens';
import { passwordValidator } from './validators/passwordValidator';
import { tuiMarkControlAsTouchedAndValidate } from '@taiga-ui/cdk';
import {
  AuthService,
  TSignUpFormData,
} from 'src/app/auth/services/auth.service';
import { TuiAlertService } from '@taiga-ui/core/components/alert';
import { Router } from '@angular/router';
import { emailInUseValidator } from 'src/app/auth/pages/sign-up/validators/emailInUseValidator';
import { Store } from '@ngrx/store';
import { selectHttpLoading } from 'src/app/store/selectors/httpLoading-selector';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'This field is required.',
        email: 'Enter a valid email.',
        passwordValidator: 'Password is invalid.',
        pattern: 'Only letters and whitespaces.',
      },
    },
  ],
})
export class SignUpComponent {
  private takenEmails: Array<string> = [];
  public submitAttempted = false;
  public httpLoading$ = this.store.select(selectHttpLoading);

  public signUpForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[\p{L} ]+$/u),
        Validators.maxLength(40),
      ],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        emailInUseValidator(this.takenEmails),
      ],
    ],
    password: ['', [Validators.required, passwordValidator()]],
  });

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    public store: Store,
  ) {}

  get passwordErrors() {
    const control = this.signUpForm.get('password');
    const errors = control?.errors?.['passwordValidator'] || [];
    return control?.touched ? errors : [];
  }

  onSubmit() {
    tuiMarkControlAsTouchedAndValidate(this.signUpForm);
    this.submitAttempted = true;
    if (this.signUpForm.valid) {
      this.signUpForm.value.name = this.signUpForm.value.name
        ?.split(' ')
        .filter((v) => !!v)
        .join(' ');

      this.auth.signUp(this.signUpForm.value as TSignUpFormData).subscribe({
        next: () => {
          this.alerts
            .open('Successfully registered.', {
              label: '(*^o^)人 (^o^*)',
              status: 'success',
            })
            .subscribe();

          this.router.navigate(['auth/signin']);
        },

        error: (e) => {
          this.alerts
            .open(`${e.message}`, {
              label: '(╯°□°）╯︵ ┻━┻',
              status: 'error',
            })
            .subscribe();

          if (
            e.type &&
            e.type === 'PrimaryDuplicationException' &&
            this.signUpForm.value.email
          ) {
            this.takenEmails.push(this.signUpForm.value.email);
            tuiMarkControlAsTouchedAndValidate(this.signUpForm);
          }
        },
      });
    }
  }
}
