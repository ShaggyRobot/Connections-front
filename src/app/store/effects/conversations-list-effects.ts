import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  TConversation,
  TConversationsListHttpResponse,
} from 'src/app/list-page/models/list-page.model';
import { conversationsListActions } from 'src/app/store/actions/conversations-list-actions';

@Injectable()
export class ConversationsListEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
  ) {}

  getConversationsList = createEffect(() => {
    return this.actions$.pipe(
      ofType(conversationsListActions.getConversationsList),
      switchMap(() =>
        this.http
          .get<TConversationsListHttpResponse>('conversations/list')
          .pipe(
            map((res) => {
              const conversations = res.Items.map(
                ({ id, companionID }): TConversation => ({
                  id: id.S,
                  companionId: companionID.S,
                }),
              );

              return conversationsListActions.getConversatiosListSuccess({
                conversations,
              });
            }),
            catchError((error) =>
              of(conversationsListActions.conversationsListError({ error })),
            ),
          ),
      ),
    );
  });

  createConversation = createEffect(() => {
    return this.actions$.pipe(
      ofType(conversationsListActions.createConversation),
      switchMap(({ companionId }) =>
        this.http
          .post<{ conversationID: string }>('conversations/create', {
            companion: companionId,
          })
          .pipe(
            map((res) =>
              conversationsListActions.createConversationSuccess({
                id: res.conversationID,
                companionId,
              }),
            ),

            catchError((error) =>
              of(conversationsListActions.conversationsListError({ error })),
            ),
          ),
      ),
    );
  });

  deleteConversation = createEffect(() => {
    return this.actions$.pipe(
      ofType(conversationsListActions.deleteConversation),

      switchMap(({ conversationID }) => {
        const params = new HttpParams().set('conversationID', conversationID);
        return this.http.delete('conversations/delete', { params }).pipe(
          map(() => {
            return conversationsListActions.deleteConversationSuccess({
              conversationID,
            });
          }),
          catchError((error) =>
            of(conversationsListActions.conversationsListError({ error })),
          ),
        );
      }),
    );
  });
}
