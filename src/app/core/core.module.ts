import { TuiIconModule, TuiSurfaceModule } from '@taiga-ui/experimental';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TuiRootModule,
  TuiButtonModule,
  TuiLinkModule,
  TuiDialogModule,
  TuiAlertModule,
  TuiThemeNightModule,
  TuiModeModule,
} from '@taiga-ui/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiToggleModule } from '@taiga-ui/kit';

import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [HeaderComponent, NotFoundComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiLinkModule,
    TuiButtonModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiButtonModule,
    TuiThemeNightModule,
    TuiModeModule,
    TuiToggleModule,
    TuiSurfaceModule,
    TuiBlockStatusModule,
    TuiIconModule,
  ],

  exports: [HeaderComponent],
})
export class CoreModule {}
