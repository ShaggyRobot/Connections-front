import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TGroup } from 'src/app/list-page/models/list-page.model';
import { TGroupsListState } from 'src/app/store/reducers/groupsList.reducer';

const selectGroupsListState =
  createFeatureSelector<TGroupsListState>('groupsList');

export const selectGroupsList = () =>
  createSelector(
    selectGroupsListState,
    (state: TGroupsListState): TGroup[] => state.groups,
  );

export const selectGroupsListError = () =>
  createSelector(
    selectGroupsListState,
    (state: TGroupsListState) => state.error,
  );
