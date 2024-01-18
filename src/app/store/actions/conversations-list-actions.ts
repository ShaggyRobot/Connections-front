import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TConversation } from 'src/app/list-page/models/list-page.model';
import { TError } from 'src/app/store/state.model';

export const conversationsListActions = createActionGroup({
  source: 'Conversations List',
  events: {
    'Get Conversations List': emptyProps(),
    'Get Conversatios List Success': props<{
      conversations: TConversation[];
    }>(),
    'Delete Conversation': props<{ conversationID: string }>(),
    'Delete Conversation Success': props<{ conversationID: string }>(),
    'Conversations List Error': props<{ error: TError }>(),
    'Create Conversation': props<{ companionId: string }>(),
    'Create Conversation Success': props<TConversation>(),
    'Clear Conversations': emptyProps(),
  },
});
