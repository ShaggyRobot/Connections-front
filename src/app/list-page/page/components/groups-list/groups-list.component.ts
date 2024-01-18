import { AsyncPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import {
  TuiAlertService,
  TuiButtonModule,
  TuiDialogModule,
  TuiHintModule,
  TuiScrollbarModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiSurfaceModule } from '@taiga-ui/experimental';
import { TuiInputModule, TuiProgressModule } from '@taiga-ui/kit';
import { takeWhile } from 'rxjs';
import { TGroup } from 'src/app/list-page/models/list-page.model';
import { GroupComponent } from 'src/app/list-page/page/components/group/group.component';
import { ListPageService } from 'src/app/list-page/services/list-page.service';
import { TimerService } from 'src/app/list-page/services/timer.service';
import { groupsListActions } from 'src/app/store/actions/groups-list-actions';
import {
  selectGroupsList,
  selectGroupsListError,
} from 'src/app/store/selectors/groups-list-selector';
import { selectHttpLoading } from 'src/app/store/selectors/httpLoading-selector';

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    GroupComponent,

    TuiHintModule,
    TuiInputModule,
    TuiDialogModule,
    TuiButtonModule,
    TuiSurfaceModule,
    TuiProgressModule,
    TuiAutoFocusModule,
    TuiScrollbarModule,
    TuiTextfieldControllerModule,
  ],
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss'],
})
export class GroupsListComponent implements OnInit {
  public groups: TGroup[] = [];

  public groups$ = this.store.select(selectGroupsList());

  public loading$ = this.store.select(selectHttpLoading);

  public dialogOpen = false;

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    public listPageService: ListPageService,
    public timerService: TimerService,
    private store: Store,
    private fb: FormBuilder,
  ) {}

  form = this.fb.group({
    groupName: [
      '',
      [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(/^[\p{L}\d ]+$/u),
      ],
    ],
  });

  ngOnInit(): void {
    this.store.select(selectGroupsList()).subscribe({
      next: (list) => {
        this.groups = list;
      },
    });

    this.store.select(selectGroupsListError()).subscribe({
      next: (e) => {
        if (e) {
          this.alerts
            .open(`${e.message}`, {
              label: '(╯°□°）╯︵ ┻━┻',
              status: 'error',
            })
            .subscribe();
        }
      },
    });

    if (!this.groups.length) {
      this.store.dispatch(groupsListActions.getGroupsList({}));
    }
  }

  openDialog() {
    this.dialogOpen = true;
  }

  onSubmit(name: string | null | undefined) {
    if (name) {
      this.store.dispatch(groupsListActions.createGroup({ groupName: name }));
      this.loading$
        .pipe(takeWhile((loading) => loading, true))
        .subscribe((loading) => {
          if (!loading) {
            this.dialogOpen = false;
            this.form.reset();
          }
        });
    }
  }

  onRefresh() {
    this.store.dispatch(groupsListActions.getGroupsList({ withTimer: true }));
  }

  // onDeleteGroup(id: string) {
  //   this.groups = this.groups.filter((group) => group.id !== id);
  // }
}
