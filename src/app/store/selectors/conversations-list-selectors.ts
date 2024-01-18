import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TConversation } from 'src/app/list-page/models/list-page.model';
import { TConversationsListState } from 'src/app/store/reducers/conversationsList.reducer';
import { TError } from 'src/app/store/state.model';

export const selectConversationsListState =
  createFeatureSelector<TConversationsListState>('conversationsList');

export const selectConversationsList = () =>
  createSelector(
    selectConversationsListState,
    (state: TConversationsListState): TConversation[] => state.conversations,
  );

export const selectConversationsListError = () =>
  createSelector(
    selectConversationsListState,
    (state: TConversationsListState): TError => state.error,
  );
