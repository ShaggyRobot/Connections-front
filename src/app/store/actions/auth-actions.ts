import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TError, TProfile } from 'src/app/store/state.model';

const authActions = createActionGroup({
  source: 'Auth',
  events: {
    'Get Profile': emptyProps(),
    'Profile Success': props<{ data: TProfile }>(),
    'Profile Error': props<{ error: TError }>(),
    'Profile Update Name': props<{ name: string }>(),
    'Profile Update Name Success': props<{ name: string }>(),
    'Profile Reset Profile State': emptyProps(),
  },
});

export { authActions };
