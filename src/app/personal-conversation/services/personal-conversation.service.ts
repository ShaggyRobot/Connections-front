import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, of, tap } from 'rxjs';

import { TimerService } from 'src/app/list-page/services/timer.service';
import { conversationsListActions } from 'src/app/store/actions/conversations-list-actions';
import { personalConversationsActions } from 'src/app/store/actions/personal-conversation-actions';

export type TPersonalConversationHttpResponse = {
  Count: number;
  Items: {
    authorID: {
      S: string;
    };
    message: {
      S: string;
    };
    createdAt: {
      S: string;
    };
  }[];
};

@Injectable({
  providedIn: 'root',
})
export class PersonalConversationService {
  constructor(
    private http: HttpClient,
    private timer: TimerService,
    private store: Store,
  ) {}

  getConversation(id: string, since?: string, withTimer?: boolean) {
    let params = new HttpParams().set('conversationID', id);

    if (since) params = params.set('since', since);

    return this.http
      .get<TPersonalConversationHttpResponse>('conversations/read', { params })
      .pipe(
        tap(() => {
          if (withTimer) this.timer.startTimer(`${id}@personal`);
        }),
      );
  }

  sendMessage(conversationID: string, message: string) {
    return this.http.post('conversations/append', { conversationID, message });
  }

  createConversation(companion: string) {
    return this.http
      .post<{ conversationID: string }>('conversations/create', {
        companion,
      })
      .pipe(
        tap((response) => {
          this.store.dispatch(
            conversationsListActions.createConversationSuccess({
              companionId: companion,
              id: response.conversationID,
            }),
          );
        }),
        catchError((error) => {
          this.store.dispatch(
            conversationsListActions.conversationsListError({ error }),
          );
          return of(error);
        }),
      );
  }

  deleteConversation(conversationId: string) {
    const params = new HttpParams().set('conversationID', conversationId);
    return this.http.delete('conversations/delete', { params }).pipe(
      tap(() => {
        this.store.dispatch(
          conversationsListActions.deleteConversationSuccess({
            conversationID: conversationId,
          }),
        );

        this.store.dispatch(
          personalConversationsActions.deletePersonalConversation({
            id: conversationId,
          }),
        );
      }),
    );
  }

  resetState() {
    this.store.dispatch(conversationsListActions.clearConversations());
  }
}
