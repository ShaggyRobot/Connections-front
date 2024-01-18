import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { authActions } from 'src/app/store/actions/auth-actions';
import { TProfile } from 'src/app/store/state.model';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private auth: AuthService,
  ) {}

  getProfile$ = createEffect(() => {
    return this.actions$.pipe(ofType(authActions.getProfile)).pipe(
      switchMap(() =>
        this.auth.getProfile().pipe(
          map((result: TProfile) =>
            authActions.profileSuccess({ data: result }),
          ),

          catchError((e) => of(authActions.profileError({ error: e }))),
        ),
      ),
    );
  });

  updateName$ = createEffect(() => {
    return this.actions$.pipe(ofType(authActions.profileUpdateName)).pipe(
      switchMap((action) =>
        this.auth.updateName(action.name).pipe(
          map(() =>
            authActions.profileUpdateNameSuccess({ name: action.name }),
          ),

          catchError((e) => of(authActions.profileError({ error: e }))),
        ),
      ),
    );
  });
}
