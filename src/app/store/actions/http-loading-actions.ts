import { createAction, props } from '@ngrx/store';

export const setHttpLoading = createAction(
  '[HttpLoading] Set Loading',
  props<{ loading: boolean }>(),
);
