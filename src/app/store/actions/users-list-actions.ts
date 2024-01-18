import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TUser } from 'src/app/list-page/models/list-page.model';
import { TError } from 'src/app/store/state.model';

export const usersListActions = createActionGroup({
  source: 'Users List',
  events: {
    'Get Users List': props<{ withTimer?: boolean }>(),
    'Get Users List Success': props<{ users: TUser[] }>(),
    'Get Users List Error': props<{ error: TError }>(),
    'Clear Users List': emptyProps(),
  },
});
