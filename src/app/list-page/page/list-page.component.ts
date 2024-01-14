import { Component } from '@angular/core';
import { TuiSurfaceModule } from '@taiga-ui/experimental';
import { GroupsListComponent } from 'src/app/list-page/page/components/groups-list/groups-list.component';
import { UsersListComponent } from 'src/app/list-page/page/components/users-list/users-list.component';

@Component({
  standalone: true,
  imports: [GroupsListComponent, UsersListComponent, TuiSurfaceModule],
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss'],
})
export class ListPageComponent {}
