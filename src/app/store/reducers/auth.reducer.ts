import { createReducer, on } from '@ngrx/store';
import { authActions } from 'src/app/store/actions/auth-actions';
import { TAuthState, TProfile } from 'src/app/store/state.model';

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

  on(authActions.profileSuccess, (state, { data }) => ({
    ...state,
    error: null,
    profile: data,
  })),

  on(authActions.profileError, (state, { error }) => ({
    ...state,
    error,
  })),

  on(authActions.profileUpdateName, (state) => ({
    ...state,
    error: null,
  })),

  on(authActions.profileUpdateNameSuccess, (state, { name }) => ({
    ...state,
    error: null,
    profile: {
      ...state.profile,
      name,
    },
  })),

  on(authActions.profileResetProfileState, () => initAuthState),
);
