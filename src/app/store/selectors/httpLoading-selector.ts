import { createFeatureSelector, createSelector } from '@ngrx/store';
import { THttpLoadingState } from 'src/app/store/reducers/httpLoading.reducer';

export const selectHttpLoadingState =
  createFeatureSelector<THttpLoadingState>('httpLoading');

export const selectHttpLoading = createSelector(
  selectHttpLoadingState,
  (state) => state.loading,
);
