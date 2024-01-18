import { AsyncPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  TuiAlertService,
  TuiButtonModule,
  TuiDialogModule,
} from '@taiga-ui/core';
import { TuiIconModule, TuiSurfaceModule } from '@taiga-ui/experimental';
import { takeWhile } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TGroup } from 'src/app/list-page/models/list-page.model';

import { groupsListActions } from 'src/app/store/actions/groups-list-actions';
import { selectHttpLoading } from 'src/app/store/selectors/httpLoading-selector';

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    RouterModule,
    TuiIconModule,
    TuiSurfaceModule,
    TuiDialogModule,
    TuiButtonModule,
  ],
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  @Input() group!: TGroup;

  @Output() uidDeleted: EventEmitter<string> = new EventEmitter();

  httpLoading = this.store.select(selectHttpLoading);

  public dialogOpen = false;

  public owned = false;

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private store: Store,
    private auth: AuthService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.auth.uid$.subscribe((uid) => {
      this.owned = uid === this.group.createdBy;
    });
  }

  form = this.fb.group({
    groupName: ['', [Validators.required]],
  });

  onDelete() {
    this.store.dispatch(
      groupsListActions.deleteGroup({ groupId: this.group.id }),
    );
    this.httpLoading.pipe(takeWhile((loading) => loading, true)).subscribe({
      next: (loading) => {
        if (!loading) {
          this.dialogOpen = false;
          this.alerts
            .open('Group was deleted successfully.', {
              label: '(*^o^)人 (^o^*)',
              status: 'success',
            })
            .subscribe();
        }
      },
    });
  }
}
