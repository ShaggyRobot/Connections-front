import { createReducer, on } from '@ngrx/store';
import { setHttpLoading } from 'src/app/store/actions/http-loading-actions';

export type THttpLoadingState = {
  loading: boolean;
};

export const initState: THttpLoadingState = { loading: false };

export const httpLoadingReducer = createReducer(
  initState,
  on(setHttpLoading, (state, { loading }) => ({
    ...state,
    loading,
  })),
);
