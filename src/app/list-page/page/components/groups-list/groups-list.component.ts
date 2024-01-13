import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiAlertService } from '@taiga-ui/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TGroup } from 'src/app/list-page/models/list-page.model';
import { ListPageService } from 'src/app/list-page/services/list-page.service';
import { TimerService } from 'src/app/list-page/services/timer.service';
import { selectHttpLoading } from 'src/app/store/selectors/httpLoading-selector';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss'],
})
export class GroupsListComponent implements OnInit {
  public groups: TGroup[] = [];
  public loading$ = this.store.select(selectHttpLoading);
  public dialogOpen = false;
  private userId?: string;

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    public listPageService: ListPageService,
    public timerService: TimerService,
    private auth: AuthService,
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
    this.auth.uid$.subscribe((userId) => (this.userId = userId));

    this.listPageService.groupsData$.subscribe((data) => {
      this.groups = data.groups;
    });

    if (!this.listPageService.groups.length) {
      this.listPageService.getGroups().subscribe({
        error: (e) => {
          this.alerts
            .open(`${e.message}`, {
              label: '(╯°□°）╯︵ ┻━┻',
              status: 'error',
            })
            .subscribe();
        },
      });
    }
  }

  openDialog() {
    this.dialogOpen = true;
  }

  onSubmit(name: string | null | undefined) {
    if (name) {
      this.listPageService.createGroup(name).subscribe({
        next: ({ groupID }) => {
          this.groups.push({
            createdAt: 'new',
            createdBy: this.userId || 'new',
            id: groupID,
            name: name,
          });

          this.form.reset();
          this.dialogOpen = false;

          this.alerts
            .open('Group was created successfully.', {
              label: '(*^o^)人 (^o^*)',
              status: 'success',
            })
            .subscribe();
        },

        error: (e) => {
          this.alerts
            .open(`${e.message}`, {
              label: '(╯°□°）╯︵ ┻━┻',
              status: 'error',
            })
            .subscribe();
        },
      });
    }
  }

  onRefresh() {
    this.listPageService.getGroups(true).subscribe({
      error: (e) => {
        this.alerts
          .open(`${e.message}`, {
            label: '(╯°□°）╯︵ ┻━┻',
            status: 'error',
          })
          .subscribe();
      },
    });
  }

  onDeleteGroup(id: string) {
    this.groups = this.groups.filter((group) => group.id !== id);
  }
}
