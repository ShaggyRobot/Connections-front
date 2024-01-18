import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TUsersHttpResponse } from 'src/app/list-page/models/list-page.model';
import { TimerService } from 'src/app/list-page/services/timer.service';
import { usersListActions } from 'src/app/store/actions/users-list-actions';

@Injectable()
export class UsersListEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private timer: TimerService,
  ) {}

  getUsersList = createEffect(() => {
    const usersTimerStarted = this.timer.timers['users'];

    return this.actions$.pipe(
      ofType(usersListActions.getUsersList),
      switchMap(({ withTimer }) =>
        this.http.get<TUsersHttpResponse>('users').pipe(
          map((res) => {
            const { Items } = res;

            const users = Items.map(({ name, uid }) => ({
              uid: uid.S,
              name: name.S,
            }));

            if (withTimer && !usersTimerStarted) {
              this.timer.startTimer('users');
            }

            return usersListActions.getUsersListSuccess({ users });
          }),

          catchError((error) =>
            of(usersListActions.getUsersListError({ error })),
          ),
        ),
      ),
    );
  });
}
