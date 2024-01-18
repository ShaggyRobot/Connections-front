import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TError, TMessage } from 'src/app/store/state.model';

const personalConversationsActions = createActionGroup({
  source: 'Personal Conversations',
  events: {
    'Get Personal Conversation': props<{ id: string; withTimer?: boolean }>(),

    'Get Personal Conversation Success': props<{
      id: string;
      messages: TMessage[];
    }>(),

    'Get Personal Conversation Since': props<{ id: string; since: string }>,

    'Get Personal Conversation Since Success': props<{
      id: string;
      messages: TMessage[];
    }>(),

    'Get Personal Conversation Error': props<{ error: TError }>(),

    'Send Personal Conversation Message': props<{
      conversationId: string;
      message: string;
    }>(),

    'Delete Personal Conversation': props<{ id: string }>(),

    'Reset Personal Conversation': emptyProps(),
  },
});

export { personalConversationsActions };
