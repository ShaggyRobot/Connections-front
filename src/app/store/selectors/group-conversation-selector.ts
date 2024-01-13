import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TGroupConversationState } from 'src/app/store/reducers/groupConversations.reducer';
import { TError, TMessage } from 'src/app/store/state.model';

const selectGroupConversationsState =
  createFeatureSelector<TGroupConversationState>('groupConversations');

export const selectGroupConversation = (conversationId: string) =>
  createSelector(
    selectGroupConversationsState,
    (state: TGroupConversationState): TMessage[] =>
      [...(state.conversations[conversationId] || [])].sort(
        (a, b) => +a.createdAt - +b.createdAt,
      ),
  );

export const selectConversationError = createSelector(
  selectGroupConversationsState,
  (state: TGroupConversationState): TError => state.error,
);
