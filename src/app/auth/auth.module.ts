import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiFieldErrorPipeModule, TuiInputModule } from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiHintModule,
  TuiTextfieldControllerModule,
  TuiLoaderModule,
} from '@taiga-ui/core';

import { TuiValidatorModule } from '@taiga-ui/cdk';
import { TuiSurfaceModule } from '@taiga-ui/experimental';
import { HttpClientModule } from '@angular/common/http';
import { SignInComponent } from './pages/sign-in/sign-in.component';

@NgModule({
  declarations: [SignUpComponent, SignInComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,

    TuiInputModule,
    TuiErrorModule,
    TuiTextfieldControllerModule,
    TuiFieldErrorPipeModule,
    TuiHintModule,
    TuiSurfaceModule,
    TuiButtonModule,
    TuiValidatorModule,
    TuiLoaderModule,
  ],
})
export class AuthModule {}
