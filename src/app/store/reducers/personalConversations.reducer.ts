import { createReducer, on } from '@ngrx/store';
import { personalConversationsActions } from 'src/app/store/actions/personal-conversation-actions';
import { TError, TConversations } from 'src/app/store/state.model';

export type TPersonalConversationState = {
  conversations: TConversations;
  isLoading: boolean;
  error: TError | null;
};

const initState: TPersonalConversationState = {
  conversations: {},
  isLoading: false,
  error: null,
};

export const personalConversationsReducer = createReducer(
  initState,
  on(personalConversationsActions.getPersonalConversations, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(
    personalConversationsActions.getPersonalConversationsSuccess,
    (state, data) => ({
      ...state,
      conversations: {
        ...state.conversations,
        [data.id]: data.messages,
      },
      isLoading: false,
      error: null,
    }),
  ),

  on(personalConversationsActions.getPersonalConversationsSince, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(
    personalConversationsActions.getPersonalConversationsSinceSuccess,
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
    personalConversationsActions.getPersonalConversationsError,
    (state, { error }) => ({
      ...state,
      error,
    }),
  ),

  on(
    personalConversationsActions.deletePersonalConversation,
    (state, { id }) => {
      const conversations = { ...state.conversations };
      delete conversations[id];

      return {
        ...state,
        conversations,
        error: null,
        isLoading: false,
      };
    },
  ),

  on(personalConversationsActions.resetPersonalConversation, () => initState),
);
