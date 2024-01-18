import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, of, tap } from 'rxjs';

import { groupsListActions } from 'src/app/store/actions/groups-list-actions';

@Injectable({
  providedIn: 'root',
})
export class ListPageService {
  constructor(
    private http: HttpClient,
    private store: Store,
  ) {}

  deleteGroup(groupId: string) {
    const params = new HttpParams().append('groupID', groupId);

    return this.http.delete('groups/delete', { params }).pipe(
      tap(() => {
        this.store.dispatch(groupsListActions.deleteGroupSuccess({ groupId }));
      }),
      catchError((error) => {
        return of(
          this.store.dispatch(groupsListActions.getGroupsListError({ error })),
        );
      }),
    );
  }
}
