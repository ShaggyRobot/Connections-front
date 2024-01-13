import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsListComponent } from 'src/app/list-page/page/components/groups-list/groups-list.component';
import { UsersListComponent } from 'src/app/list-page/page/components/users-list/users-list.component';
import { ListPageComponent } from 'src/app/list-page/page/list-page.component';
import { ListPageRoutingModule } from 'src/app/list-page/list-page-routing.module';
import { TuiIconModule, TuiSurfaceModule } from '@taiga-ui/experimental';
import {
  TuiButtonModule,
  TuiDialogModule,
  TuiHintModule,
  TuiScrollbarModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiInputModule, TuiProgressModule } from '@taiga-ui/kit';
import { GroupComponent } from './page/components/group/group.component';
import { UserComponent } from './page/components/user/user.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    GroupsListComponent,
    UsersListComponent,
    ListPageComponent,
    GroupComponent,
    UserComponent,
  ],
  imports: [
    CommonModule,
    ListPageRoutingModule,

    ReactiveFormsModule,

    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiSurfaceModule,
    TuiScrollbarModule,
    TuiButtonModule,
    TuiProgressModule,
    TuiIconModule,
    TuiDialogModule,
    TuiHintModule
  ],
})
export class ListPageModule {}
