import { createReducer, on } from '@ngrx/store';
import { setHttpLoading } from 'src/app/store/actions/http-loading-actions';
import { storeReset } from 'src/app/store/actions/store-reset';

export type THttpLoadingState = {
  loading: boolean;
};

export const initState: THttpLoadingState = { loading: false };

export const httpLoadingReducer = createReducer(
  initState,
  on(
    setHttpLoading,
    (state, { loading }): THttpLoadingState => ({
      ...state,
      loading,
    }),
  ),

  on(storeReset, (): THttpLoadingState => initState),
);
