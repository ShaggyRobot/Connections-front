import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TAuthState } from 'src/app/store/state.model';

const selectAuthState = createFeatureSelector<TAuthState>('auth');

const selectProfile = createSelector(
  selectAuthState,
  (state: TAuthState) => state.profile,
);

const selectProfileError = createSelector(
  selectAuthState,
  (state: TAuthState) => state.error,
);

export { selectProfile, selectProfileError };
