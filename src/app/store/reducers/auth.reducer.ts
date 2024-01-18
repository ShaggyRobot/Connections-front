import { createReducer, on } from '@ngrx/store';
import { authActions } from 'src/app/store/actions/auth-actions';
import { storeReset } from 'src/app/store/actions/store-reset';
import { TAuthState } from 'src/app/store/state.model';

export const initAuthState: TAuthState = {
  error: null,
  profile: {
    createdAt: '',
    email: localStorage.getItem('login') || '',
    name: '',
    uid: localStorage.getItem('uid') || '',
  },
};

export const authReducer = createReducer(
  initAuthState,
  on(
    authActions.getProfile,
    (state): TAuthState => ({
      ...state,
      error: null,
    }),
  ),

  on(
    authActions.profileSuccess,
    (state, { data }): TAuthState => ({
      ...state,
      error: null,
      profile: data,
    }),
  ),

  on(
    authActions.profileError,
    (state, { error }): TAuthState => ({
      ...state,
      error,
    }),
  ),

  on(
    authActions.profileUpdateName,
    (state): TAuthState => ({
      ...state,
      error: null,
    }),
  ),

  on(
    authActions.profileUpdateNameSuccess,
    (state, { name }): TAuthState => ({
      ...state,
      error: null,
      profile: {
        ...state.profile,
        name,
      },
    }),
  ),

  on(
    storeReset,
    (): TAuthState => ({
      error: null,
      profile: {
        createdAt: '',
        email: '',
        name: '',
        uid: '',
      },
    }),
  ),
);
