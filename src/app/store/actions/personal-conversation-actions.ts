import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TError, TMessage } from 'src/app/store/state.model';

const personalConversationsActions = createActionGroup({
  source: 'Personal Conversations',
  events: {
    'Get Personal Conversations': props<{ id: string; withTimer?: boolean }>(),

    'Get Personal Conversations Success': props<{
      id: string;
      messages: TMessage[];
    }>(),

    'Get Personal Conversations Since': props<{ id: string; since: string }>,

    'Get Personal Conversations Since Success': props<{
      id: string;
      messages: TMessage[];
    }>(),

    'Get Personal Conversations Error': props<{ error: TError }>(),

    'Send Personal Conversation Message': props<{
      conversationId: string;
      message: string;
    }>(),

    'Delete Personal Conversation': props<{ id: string }>(),

    'Reset Personal Conversation': emptyProps(),
  },
});

export { personalConversationsActions };
