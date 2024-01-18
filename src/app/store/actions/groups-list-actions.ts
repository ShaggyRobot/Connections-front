import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TGroup } from 'src/app/list-page/models/list-page.model';
import { TError } from 'src/app/store/state.model';

const groupsListActions = createActionGroup({
  source: 'Groups List',
  events: {
    'Get Groups List': props<{ withTimer?: boolean }>(),
    'Get Groups List Success': props<{ groups: TGroup[] }>(),
    'Get Groups List Error': props<{ error: TError }>(),
    'Create Group': props<{ groupName: string }>(),
    'Create Group Success': props<{ groupID: string; groupName: string }>(),
    'Delete Group': props<{ groupId: string }>(),
    'Delete Group Success': props<{ groupId: string }>(),
    'Clear Groups': emptyProps(),
  },
});

export { groupsListActions };
