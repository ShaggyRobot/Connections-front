import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  TGroup,
  TGroupsHttpResponse,
} from 'src/app/list-page/models/list-page.model';
import { TimerService } from 'src/app/list-page/services/timer.service';
import { groupsListActions } from 'src/app/store/actions/groups-list-actions';

@Injectable()
export class GroupsListEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private timer: TimerService,
  ) {}

  getGroupsList = createEffect(() => {
    const groupsTimerStarted = this.timer.timers['groups'];

    return this.actions$.pipe(
      ofType(groupsListActions.getGroupsList),
      switchMap(({ withTimer }) => {
        return this.http.get<TGroupsHttpResponse>('groups/list').pipe(
          map((res) => {
            const { Items } = res;
            const groups: TGroup[] = Items.map(
              ({ id, name, createdAt, createdBy }) => ({
                id: id.S,
                name: name.S,
                createdAt: createdAt.S,
                createdBy: createdBy.S,
              }),
            );

            if (withTimer && !groupsTimerStarted) {
              this.timer.startTimer('groups');
            }

            return groupsListActions.getGroupsListSuccess({ groups });
          }),

          catchError((error) =>
            of(groupsListActions.getGroupsListError({ error })),
          ),
        );
      }),
    );
  });

  createGroup = createEffect(() => {
    return this.actions$.pipe(
      ofType(groupsListActions.createGroup),
      switchMap(({ groupName }) =>
        this.http
          .post<{ groupID: string }>('groups/create', {
            name: groupName,
          })
          .pipe(
            map(({ groupID }) =>
              groupsListActions.createGroupSuccess({ groupID, groupName }),
            ),
            catchError((error) =>
              of(groupsListActions.getGroupsListError({ error })),
            ),
          ),
      ),
    );
  });

  deleteGroup = createEffect(() => {
    return this.actions$.pipe(
      ofType(groupsListActions.deleteGroup),
      switchMap(({ groupId }) => {
        const params = new HttpParams().append('groupID', groupId);
        return this.http.delete('groups/delete', { params }).pipe(
          map(() => {
            return groupsListActions.deleteGroupSuccess({ groupId });
          }),
          catchError((error) =>
            of(groupsListActions.getGroupsListError({ error })),
          ),
        );
      }),
    );
  });
}
