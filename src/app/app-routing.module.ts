import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/auth/guards/auth-guard';
import { NotFoundComponent } from 'src/app/core/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./list-page/list-page.module').then(
        (module) => module.ListPageModule,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((module) => module.AuthModule),
    canActivate: [authGuard],
    data: { invert: true },
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((module) => module.ProfileModule),
    canActivate: [authGuard],
  },
  {
    path: 'group/:id',
    loadChildren: () =>
      import('./group-conversation/group-conversation.module').then(
        (module) => module.GroupConversationModule,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'conversation/:id',
    loadChildren: () =>
      import('./personal-conversation/personal-conversation.module').then(
        (module) => module.PersonalConversationModule,
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule],
})
export class AppRoutingModule {}
