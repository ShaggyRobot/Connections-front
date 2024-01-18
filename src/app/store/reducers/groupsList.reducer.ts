import { createReducer, on } from '@ngrx/store';
import { TGroup } from 'src/app/list-page/models/list-page.model';
import { groupsListActions } from 'src/app/store/actions/groups-list-actions';
import { storeReset } from 'src/app/store/actions/store-reset';
import { TError } from 'src/app/store/state.model';

export type TGroupsListState = {
  groups: TGroup[];
  error: TError | null;
};

const initState: TGroupsListState = {
  groups: [],
  error: null,
};

export const groupsListReducer = createReducer(
  initState,

  on(
    groupsListActions.getGroupsListSuccess,
    (state, data): TGroupsListState => ({
      ...state,
      groups: data.groups,
    }),
  ),

  on(
    groupsListActions.getGroupsListError,
    (state, data): TGroupsListState => ({
      ...state,
      error: data.error,
    }),
  ),

  on(
    groupsListActions.deleteGroupSuccess,
    (state, data): TGroupsListState => ({
      error: null,
      groups: state.groups.filter((group) => group.id !== data.groupId),
    }),
  ),

  on(groupsListActions.createGroupSuccess, (state, data): TGroupsListState => {
    const { groupID, groupName } = data;
    const newGroup: TGroup = {
      createdAt: String(new Date()),
      createdBy: localStorage.getItem('uid') || 'null',
      id: groupID,
      name: groupName,
    };

    return {
      error: null,
      groups: [...state.groups, newGroup],
    };
  }),

  on(storeReset, (): TGroupsListState => initState),
);
