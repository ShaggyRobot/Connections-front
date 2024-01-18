import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TUsersListState } from 'src/app/store/reducers/users.reducer';

export const selectUsersListState =
  createFeatureSelector<TUsersListState>('usersList');

export const selectUsersList = () =>
  createSelector(selectUsersListState, (state: TUsersListState) => state.users);

export const selectUsersListError = () =>
  createSelector(selectUsersListState, (state: TUsersListState) => state.error);
