import { createReducer, on } from '@ngrx/store';
import { personalConversationsActions } from 'src/app/store/actions/personal-conversation-actions';
import { storeReset } from 'src/app/store/actions/store-reset';
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
  on(
    personalConversationsActions.getPersonalConversation,
    (state): TPersonalConversationState => ({
      ...state,
      isLoading: true,
      error: null,
    }),
  ),

  on(
    personalConversationsActions.getPersonalConversationSuccess,
    (state, data): TPersonalConversationState => ({
      ...state,
      conversations: {
        ...state.conversations,
        [data.id]: data.messages,
      },
      isLoading: false,
      error: null,
    }),
  ),

  on(
    personalConversationsActions.getPersonalConversationSince,
    (state): TPersonalConversationState => ({
      ...state,
      isLoading: true,
      error: null,
    }),
  ),

  on(
    personalConversationsActions.getPersonalConversationSinceSuccess,
    (state, { id, messages }): TPersonalConversationState => ({
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
    personalConversationsActions.getPersonalConversationError,
    (state, { error }): TPersonalConversationState => ({
      ...state,
      error,
    }),
  ),

  on(
    personalConversationsActions.deletePersonalConversation,
    (state, { id }): TPersonalConversationState => {
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

  on(storeReset, (): TPersonalConversationState => initState),
);
