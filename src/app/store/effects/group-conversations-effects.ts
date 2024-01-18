import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, take } from 'rxjs';
import { GroupConversationService } from 'src/app/group-conversation/services/group-conversation.service';
import { groupConversationsActions } from 'src/app/store/actions/group-conversations-actions';
import { selectGroupConversation } from 'src/app/store/selectors/group-conversation-selector';
import { TMessage } from 'src/app/store/state.model';

@Injectable()
export class GroupConversationsEffects {
  constructor(
    private actions$: Actions,
    private conversations: GroupConversationService,
    private store: Store,
  ) {}

  getConversation = createEffect(() => {
    return this.actions$.pipe(
      ofType(groupConversationsActions.getGroupConversations),
      switchMap(({ id, withTimer }) =>
        this.store.select(selectGroupConversation(id)).pipe(
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
                    return groupConversationsActions.getGroupConversationsSinceSuccess(
                      { id, messages },
                    );
                  }
                  return groupConversationsActions.getGroupConversationsSuccess(
                    { id, messages },
                  );
                }),

                catchError((e) =>
                  of(
                    groupConversationsActions.getGroupConversationsError({
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
      ofType(groupConversationsActions.sendGroupConversationMessage),
      switchMap(({ groupId, message }) =>
        this.conversations.sendMessage(groupId, message).pipe(
          switchMap(() =>
            this.store.select(selectGroupConversation(groupId)).pipe(take(1)),
          ),
          switchMap((messageList) => {
            const since = messageList.at(-1)?.createdAt;

            return this.conversations.getConversation(groupId, since).pipe(
              map((result) => {
                const messages: TMessage[] = result.Items.map(
                  (item): TMessage => ({
                    authorID: item.authorID.S,
                    message: item.message.S,
                    createdAt: item.createdAt.S,
                  }),
                );

                if (since) {
                  return groupConversationsActions.getGroupConversationsSinceSuccess(
                    { id: groupId, messages },
                  );
                }
                return groupConversationsActions.getGroupConversationsSuccess({
                  id: groupId,
                  messages,
                });
              }),

              catchError((e) => {
                return of(
                  groupConversationsActions.getGroupConversationsError({
                    error: e,
                  }),
                );
              }),
            );
          }),
        ),
      ),
    );
  });
}
