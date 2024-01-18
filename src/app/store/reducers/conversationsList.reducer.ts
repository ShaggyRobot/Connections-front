import { createReducer, on } from '@ngrx/store';
import { TConversation } from 'src/app/list-page/models/list-page.model';
import { conversationsListActions } from 'src/app/store/actions/conversations-list-actions';
import { storeReset } from 'src/app/store/actions/store-reset';
import { TError } from 'src/app/store/state.model';

export type TConversationsListState = {
  conversations: TConversation[];
  error: TError | null;
};

const initState: TConversationsListState = {
  conversations: [],
  error: null,
};

export const conversationsListReducer = createReducer(
  initState,

  on(
    conversationsListActions.getConversatiosListSuccess,
    (state, data): TConversationsListState => ({
      error: null,
      conversations: data.conversations,
    }),
  ),

  on(
    conversationsListActions.createConversationSuccess,
    (state, data): TConversationsListState => ({
      error: null,
      conversations: [
        ...state.conversations,
        { id: data.id, companionId: data.companionId },
      ],
    }),
  ),

  on(
    conversationsListActions.deleteConversationSuccess,
    (state, data): TConversationsListState => ({
      error: null,
      conversations: state.conversations.filter(
        (c) => c.id !== data.conversationID,
      ),
    }),
  ),

  on(
    conversationsListActions.conversationsListError,
    (state, data): TConversationsListState => ({
      ...state,
      error: data.error,
    }),
  ),

  on(storeReset, (): TConversationsListState => initState),
);
