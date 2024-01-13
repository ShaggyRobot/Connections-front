import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from 'src/app/auth/pages/sign-in/sign-in.component';
import { SignUpComponent } from 'src/app/auth/pages/sign-up/sign-up.component';

const routes: Routes = [
  {
    path: 'signup',
    component: SignUpComponent,
  },
  { path: 'signin', component: SignInComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
