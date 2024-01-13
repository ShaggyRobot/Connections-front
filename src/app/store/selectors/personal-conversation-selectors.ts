import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TPersonalConversationState } from 'src/app/store/reducers/personalConversations.reducer';
import { TError, TMessage } from 'src/app/store/state.model';

const selectPersonalConversationsState =
  createFeatureSelector<TPersonalConversationState>('personalConversations');

export const selectPersonalConversation = (conversationId: string) =>
  createSelector(
    selectPersonalConversationsState,
    (state: TPersonalConversationState): TMessage[] =>
      [...(state.conversations[conversationId] || [])].sort(
        (a, b) => +a.createdAt - +b.createdAt,
      ),
  );

export const selectPersonalConversationError = createSelector(
  selectPersonalConversationsState,
  (state: TPersonalConversationState): TError => state.error,
);
