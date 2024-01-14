import { Routes } from '@angular/router';
import { authGuard } from 'src/app/auth/guards/auth-guard';
import { NotFoundComponent } from 'src/app/core/not-found/not-found.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('src/app/list-page/list-page.routes').then(
        (routes) => routes.LIST_PAGE_ROUTES,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('src/app/auth/auth.routes').then((routes) => routes.AUTH_ROUTES),
    canActivate: [authGuard],
    data: { invert: true },
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('src/app/profile/profile.routes').then(
        (routes) => routes.PROFILE_ROUTES,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'group/:id',
    loadChildren: () =>
      import('src/app/group-conversation/group-conversation.routes').then(
        (routes) => routes.GROUT_CONVERSATION_ROUTES,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'conversation/:id',
    loadChildren: () =>
      import('src/app/personal-conversation/personal-conversation.routes').then(
        (routes) => routes.PERSONAL_CONVERSATION_ROUTES,
      ),
    canActivate: [authGuard],
  },
  {
    path: '404',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
