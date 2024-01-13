import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from 'src/app/profile/components/profile/profile.component';
import { TuiLoaderModule } from '@taiga-ui/core/components/loader';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiAlertModule } from '@taiga-ui/core/components/alert';
import { TuiButtonModule, TuiErrorModule } from '@taiga-ui/core/components';
import { TuiInputModule } from '@taiga-ui/kit/components';
import { TuiTextfieldControllerModule } from '@taiga-ui/core/directives';
import { TuiSurfaceModule } from '@taiga-ui/experimental/directives/surface';
import { ProfileRoutingModule } from 'src/app/profile/profile-routing.module';
import { TuiFieldErrorPipeModule } from '@taiga-ui/kit';



@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,

    ReactiveFormsModule,

    TuiLoaderModule,
    TuiButtonModule,
    TuiInputModule,
    TuiSurfaceModule,
    TuiTextfieldControllerModule,
    TuiAlertModule,
    TuiFieldErrorPipeModule,
    TuiErrorModule,
  ]
})
export class ProfileModule { }
