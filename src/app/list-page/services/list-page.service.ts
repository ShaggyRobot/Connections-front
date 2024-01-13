import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, tap, throwError } from 'rxjs';
import {
  TGroup,
  TGroupList,
  TGroupsHttpResponse,
  TUser,
  TUserList,
  TUsersHttpResponse,
} from 'src/app/list-page/models/list-page.model';
import { TimerService } from 'src/app/list-page/services/timer.service';

@Injectable({
  providedIn: 'root',
})
export class ListPageService {
  private groupsData = new BehaviorSubject<TGroupList>({
    count: 0,
    groups: [],
  });
  private usersData = new BehaviorSubject<TUserList>({ count: 0, users: [] });

  public groupsData$ = this.groupsData.asObservable();
  public usersData$ = this.usersData.asObservable();

  public users: TUser[] = [];
  public groups: TGroup[] = [];

  constructor(
    private http: HttpClient,
    private timer: TimerService,
  ) {}

  getGroups(withTimer?: boolean) {
    const groupsTimerStarted = this.timer.timers['groups'];

    return this.http.get<TGroupsHttpResponse>('groups/list').pipe(
      map((res) => {
        const { Count: count, Items } = res;
        const groups: TGroup[] = Items.map(
          ({ id, name, createdAt, createdBy }) => ({
            id: id.S,
            name: name.S,
            createdAt: createdAt.S,
            createdBy: createdBy.S,
          }),
        );

        this.groupsData.next({
          count,
          groups,
        });

        if (withTimer && !groupsTimerStarted) {
          this.timer.startTimer('groups');
        }

        this.groups = groups;
      }),

      catchError((e) => throwError(() => e)),
    );
  }

  getUsers(withTimer?: boolean) {
    const timerStarted = this.timer.timers['users'];

    return this.http.get<TUsersHttpResponse>('users').pipe(
      map((res) => {
        const { Count: count, Items } = res;
        const users = Items.map(({ name, uid }) => ({
          uid: uid.S,
          name: name.S,
        }));

        this.usersData.next({
          count,
          users,
        });

        if (withTimer && !timerStarted) {
          this.timer.startTimer('users');
        }

        this.users = users;
      }),
      catchError((e) => throwError(() => e)),
    );
  }

  createGroup(groupName: string) {
    return this.http
      .post<{ groupID: string }>('groups/create', {
        name: groupName,
      })
      .pipe(catchError((e) => throwError(() => e)));
  }

  deleteGroup(groupId: string) {
    const params = new HttpParams().append('groupID', groupId);

    return this.http.delete('groups/delete', { params: params }).pipe(
      tap(() => {
        const oldGroupsData = this.groupsData.getValue();
        this.groupsData.next({
          ...oldGroupsData,
          groups: oldGroupsData.groups.filter((group) => group.id !== groupId),
        });
      }),
    );
  }

  resetState() {
    this.users = [];
    this.groups = [];
  }
}
