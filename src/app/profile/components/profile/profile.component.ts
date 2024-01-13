import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiAlertService } from '@taiga-ui/core/components/alert';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';

import {
  BehaviorSubject,
  Subject,
  combineLatest,
  distinctUntilChanged,
  skip,
  take,
  takeUntil,
  tap,
} from 'rxjs';

import { AuthService } from 'src/app/auth/services/auth.service';
import { authActions } from 'src/app/store/actions/auth-actions';

import {
  selectProfile,
  selectProfileError,
} from 'src/app/store/selectors/auth-selectors';

import { selectHttpLoading } from 'src/app/store/selectors/httpLoading-selector';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        pattern: 'Only letters and whitespaces.',
      },
    },
  ],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private name$ = new BehaviorSubject<string | undefined>('');
  public error$ = this.store.select(selectProfileError);
  public profileData$ = this.store.select(selectProfile);
  public loading$ = this.store.select(selectHttpLoading);

  private alertPending = false;
  public editingName = false;

  nameForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[\p{L} ]+$/u), Validators.maxLength(40)]],
  });

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private store: Store,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const nameControl = this.nameForm.get('name');

    nameControl?.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
      nameControl.markAsTouched();
    });

    combineLatest([this.profileData$, this.auth.isLoggedIn$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([data, loggedIn]) => {
        if (data) {
          this.nameForm.patchValue({ name: data.name });
          this.name$.next(data.name);
        }

        if (!data.uid && loggedIn) {
          this.store.dispatch(authActions.getProfile());
        }
      });

    this.error$.pipe(takeUntil(this.destroy$)).subscribe((err) => {
      if (err) {
        this.alerts
          .open(`${err.message}`, {
            label: '(╯°□°）╯︵ ┻━┻',
            status: 'error',
          })
          .subscribe();
      }
    });
  }

  onSubmit() {
    this.alertPending = false;
    this.editingName = !this.editingName;

    if (this.nameForm.valid) {
      this.store.dispatch(
        authActions.profileUpdateName({ name: this.nameForm.value.name! }),
      );
    }

    this.profileData$
      .pipe(
        skip(1),
        take(1),
        tap((profile) => {
          if (!this.alertPending) {
            this.alerts
              .open(`Enjoy your new name, ${profile.name}`, {
                label: '(¬‿¬)',
                status: 'success',
              })
              .subscribe();
          }
          this.alertPending = true;
        }),
      )
      .subscribe();
  }

  onLogOut() {
    this.auth
      .logOut()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.alerts
            .open('Come back soon.', {
              label: '(╥﹏╥)',
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
        },
      });
  }

  handleChancel() {
    this.editingName = false;
    this.nameForm.patchValue({ name: this.name$.value });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
