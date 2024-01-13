import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { tuiMarkControlAsTouchedAndValidate } from '@taiga-ui/cdk/utils';
import { TuiAlertService } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit/tokens';
import {
  AuthService,
  TSignInFormData,
} from 'src/app/auth/services/auth.service';
import { selectHttpLoading } from 'src/app/store/selectors/httpLoading-selector';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'This field is required.',
        email: 'Enter valid email',
      },
    },
  ],
})
export class SignInComponent implements OnInit {
  public submitAttempted = false;
  public loading$ = this.store.select(selectHttpLoading);
  public attemptFailed = false;

  public signInForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private store: Store,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
  ) {}

  ngOnInit(): void {
    this.signInForm.valueChanges.subscribe(() => (this.attemptFailed = false));
  }

  onSubmit() {
    this.submitAttempted = true;
    tuiMarkControlAsTouchedAndValidate(this.signInForm);
    if (this.signInForm.valid) {
      this.auth.signIn(this.signInForm.value as TSignInFormData).subscribe({
        next: () => {
          this.alerts
            .open('Successfully logged in.', {
              label: '(*^o^)人 (^o^*)',
              status: 'success',
            })
            .subscribe();
          this.router.navigate(['/']);
        },

        error: (e) => {
          this.alerts
            .open(`${e.message}`, {
              label: '(╯°□°）╯︵ ┻━┻',
              status: 'error',
            })
            .subscribe();

          if (e.type === 'NotFoundException') {
            this.attemptFailed = true;
          }
        },
      });
    }
  }
}
