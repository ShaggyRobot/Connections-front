import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, take } from 'rxjs';
import { PersonalConversationService } from 'src/app/personal-conversation/services/personal-conversation.service';
import { personalConversationsActions } from 'src/app/store/actions/personal-conversation-actions';
import { selectPersonalConversation } from 'src/app/store/selectors/personal-conversation-selectors';
import { TMessage } from 'src/app/store/state.model';

@Injectable()
export class PersonalConversationsEffects {
  constructor(
    private actions$: Actions,
    private conversations: PersonalConversationService,
    private store: Store,
  ) {}

  getConversation = createEffect(() => {
    return this.actions$.pipe(
      ofType(personalConversationsActions.getPersonalConversation),
      switchMap(({ id, withTimer }) =>
        this.store.select(selectPersonalConversation(id)).pipe(
          take(1),
          switchMap((messageList) => {
            const since = messageList.at(-1)?.createdAt;

            return this.conversations
              .getConversation(id, since, withTimer)
              .pipe(
                map((result) => {
                  const messages: TMessage[] = result.Items.map(
                    (item): TMessage => ({
                      authorID: item.authorID.S,
                      message: item.message.S,
                      createdAt: item.createdAt.S,
                    }),
                  );

                  if (since) {
                    return personalConversationsActions.getPersonalConversationSinceSuccess(
                      { id, messages },
                    );
                  }
                  return personalConversationsActions.getPersonalConversationSuccess(
                    { id, messages },
                  );
                }),

                catchError((e) =>
                  of(
                    personalConversationsActions.getPersonalConversationError({
                      error: e,
                    }),
                  ),
                ),
              );
          }),
        ),
      ),
    );
  });

  sendMessage = createEffect(() => {
    return this.actions$.pipe(
      ofType(personalConversationsActions.sendPersonalConversationMessage),
      switchMap(({ conversationId, message }) =>
        this.conversations.sendMessage(conversationId, message).pipe(
          switchMap(() =>
            this.store
              .select(selectPersonalConversation(conversationId))
              .pipe(take(1)),
          ),
          switchMap((messageList) => {
            const since = messageList.at(-1)?.createdAt;

            return this.conversations
              .getConversation(conversationId, since)
              .pipe(
                map((result) => {
                  const messages: TMessage[] = result.Items.map(
                    (item): TMessage => ({
                      authorID: item.authorID.S,
                      message: item.message.S,
                      createdAt: item.createdAt.S,
                    }),
                  );

                  if (since) {
                    return personalConversationsActions.getPersonalConversationSinceSuccess(
                      { id: conversationId, messages },
                    );
                  }
                  return personalConversationsActions.getPersonalConversationSuccess(
                    { id: conversationId, messages },
                  );
                }),

                catchError((e) => {
                  return of(
                    personalConversationsActions.getPersonalConversationError({
                      error: e,
                    }),
                  );
                }),
              );
          }),

          catchError((e) => {
            return of(
              personalConversationsActions.getPersonalConversationError({
                error: e,
              }),
            );
          }),
        ),
      ),
    );
  });
}
