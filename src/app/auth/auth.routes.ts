import { Routes } from '@angular/router';

import { SignInComponent } from 'src/app/auth/pages/sign-in/sign-in.component';
import { SignUpComponent } from 'src/app/auth/pages/sign-up/sign-up.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: 'signin',
    component: SignInComponent,
  },
];
