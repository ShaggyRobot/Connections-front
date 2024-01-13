import { createReducer, on } from '@ngrx/store';
import { groupConversationsActions } from 'src/app/store/actions/group-conversations-actions';
import { TError, TConversations } from 'src/app/store/state.model';

export type TGroupConversationState = {
  conversations: TConversations;
  isLoading: boolean;
  error: TError | null;
};

const initState: TGroupConversationState = {
  conversations: {},
  isLoading: false,
  error: null,
};

export const groupConversationsReducer = createReducer(
  initState,
  on(groupConversationsActions.getGroupConversations, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(groupConversationsActions.getGroupConversationsSuccess, (state, data) => ({
    ...state,
    conversations: {
      ...state.conversations,
      [data.id]: data.messages,
    },
    isLoading: false,
    error: null,
  })),

  on(groupConversationsActions.getGroupConversationsSince, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(
    groupConversationsActions.getGroupConversationsSinceSuccess,
    (state, { id, messages }) => ({
      ...state,
      conversations: {
        ...state.conversations,
        [id]: [...state.conversations[id], ...messages],
      },
      isLoading: false,
      error: null,
    }),
  ),

  on(
    groupConversationsActions.getGroupConversationsError,
    (state, { error }) => ({
      ...state,
      error,
    }),
  ),

  on(groupConversationsActions.deleteGroupConversation, (state, { id }) => {
    const conversations = { ...state.conversations };
    delete conversations[id];

    return {
      ...state,
      conversations,
      error: null,
      isLoading: false,
    };
  }),

  on(groupConversationsActions.resetGroupConversation, () => initState),
);
