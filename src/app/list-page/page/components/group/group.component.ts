import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiAlertService } from '@taiga-ui/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TGroup } from 'src/app/list-page/models/list-page.model';
import { ListPageService } from 'src/app/list-page/services/list-page.service';
import { selectHttpLoading } from 'src/app/store/selectors/httpLoading-selector';

@Component({
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
    private listPageService: ListPageService,
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
    this.listPageService.deleteGroup(this.group.id).subscribe({
      next: () => {
        this.uidDeleted.emit(this.group.id);
        this.dialogOpen = false;

        this.alerts
          .open('Group was deleted successfully.', {
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
