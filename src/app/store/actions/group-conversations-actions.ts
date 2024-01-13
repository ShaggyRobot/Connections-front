import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TError, TMessage } from 'src/app/store/state.model';

const groupConversationsActions = createActionGroup({
  source: 'Group Conversations',
  events: {
    'Get Group Conversations': props<{ id: string; withTimer?: boolean }>(),

    'Get Group Conversations Success': props<{
      id: string;
      messages: TMessage[];
    }>(),

    'Get Group Conversations Since': props<{ id: string; since: string }>,

    'Get Group Conversations Since Success': props<{
      id: string;
      messages: TMessage[];
    }>(),

    'Get Group Conversations Error': props<{ error: TError }>(),

    'Send Group Conversation Message': props<{
      groupId: string;
      message: string;
    }>(),

    'Delete Group Conversation': props<{ id: string }>(),

    'Reset Group Conversation': emptyProps(),
  },
});

export { groupConversationsActions };
