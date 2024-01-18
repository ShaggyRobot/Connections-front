import { createReducer, on } from '@ngrx/store';
import { TUser } from 'src/app/list-page/models/list-page.model';
import { storeReset } from 'src/app/store/actions/store-reset';
import { usersListActions } from 'src/app/store/actions/users-list-actions';
import { TError } from 'src/app/store/state.model';

export type TUsersListState = {
  users: TUser[];
  error: TError | null;
};

const initState: TUsersListState = {
  users: [],
  error: null,
};

export const usersListReducer = createReducer(
  initState,

  on(
    usersListActions.getUsersListSuccess,
    (state, data): TUsersListState => ({
      error: null,
      users: data.users,
    }),
  ),

  on(
    usersListActions.getUsersListError,
    (state, data): TUsersListState => ({
      ...state,
      error: data.error,
    }),
  ),

  on(storeReset, (): TUsersListState => initState),
);
