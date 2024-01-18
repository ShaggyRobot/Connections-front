import { AsyncPipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  TuiAlertService,
  TuiButtonModule,
  TuiDialogModule,
} from '@taiga-ui/core';
import { Observable, Subject, combineLatest, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TMessageWithName } from 'src/app/core/conversation/components/message/message.component';
import { ConversationComponent } from 'src/app/core/conversation/conversation.component';
import { TUser } from 'src/app/list-page/models/list-page.model';
import { ListPageService } from 'src/app/list-page/services/list-page.service';
import { TimerService } from 'src/app/list-page/services/timer.service';
import { groupConversationsActions } from 'src/app/store/actions/group-conversations-actions';
import { groupsListActions } from 'src/app/store/actions/groups-list-actions';
import { usersListActions } from 'src/app/store/actions/users-list-actions';
import {
  selectConversationError,
  selectGroupConversation,
} from 'src/app/store/selectors/group-conversation-selector';
import { selectGroupsList } from 'src/app/store/selectors/groups-list-selector';
import { selectHttpLoading } from 'src/app/store/selectors/httpLoading-selector';
import { selectUsersList } from 'src/app/store/selectors/users-list-selectors';
import { TMessage } from 'src/app/store/state.model';

@Component({
  standalone: true,
  imports: [AsyncPipe, ConversationComponent, TuiDialogModule, TuiButtonModule],
  selector: 'app-group-conversation',
  templateUrl: './group-conversation.component.html',
  styleUrls: ['./group-conversation.component.scss'],
})
export class GroupConversationComponent implements OnInit, OnDestroy {
  public id: string = '';

  private destroy = new Subject<void>();

  private users: TUser[] = [];

  public dialogOpen = false;

  public owned = false;

  public httpLoading = this.store.select(selectHttpLoading);

  private error$ = this.store.select(selectConversationError);

  public conversation$: Observable<TMessage[]> = new Observable();

  public messagesWithNames$: Observable<TMessageWithName[]> = new Observable();

  public messagesWithNames: TMessageWithName[] = [];

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    public timer: TimerService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private listPageService: ListPageService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.store.select(selectUsersList()).subscribe((list) => {
      if (!list.length) {
        this.store.dispatch(usersListActions.getUsersList({}));
      }

      this.users = list;
    });

    this.store.select(selectGroupsList()).subscribe((list) => {
      if (!list.length) {
        this.store.dispatch(groupsListActions.getGroupsList({}));
      }
    });

    this.route.params.pipe(takeUntil(this.destroy)).subscribe((params) => {
      this.id = params['id'];
      combineLatest([this.store.select(selectGroupsList()), this.auth.uid$])
        .pipe(takeUntil(this.destroy))
        .subscribe(([groupsData, uid]) => {
          const group = groupsData.find(
            (groupItem) => groupItem.id === params['id'],
          );

          if (group?.createdBy === uid) this.owned = true;
        });

      this.store.dispatch(
        groupConversationsActions.getGroupConversations({ id: params['id'] }),
      );

      combineLatest([
        this.store.select(selectGroupConversation(this.id)),
        this.auth.uid$,
      ])
        .pipe(takeUntil(this.destroy))
        .subscribe(([conversation, uid]) => {
          const messages = conversation.map(
            ({ authorID, createdAt, message }): TMessageWithName => ({
              authorID,
              createdAt,
              message,
              name:
                this.users.find((user) => user.uid === authorID)?.name ||
                'null',
              owner: authorID === uid,
            }),
          );
          this.messagesWithNames = messages;
        });
    });

    this.error$.pipe(takeUntil(this.destroy)).subscribe((e) => {
      if (e) {
        this.alerts
          .open(`${e.message}`, {
            label: '(╯°□°）╯︵ ┻━┻',
            status: 'error',
          })
          .subscribe();
      }
    });
  }

  onSend(message: string) {
    this.store.dispatch(
      groupConversationsActions.sendGroupConversationMessage({
        groupId: this.id,
        message,
      }),
    );
  }

  onRefresh() {
    this.store.dispatch(
      groupConversationsActions.getGroupConversations({
        id: this.id,
        withTimer: true,
      }),
    );
  }

  onDelete() {
    this.listPageService
      .deleteGroup(this.id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.dialogOpen = false;
          this.router.navigate(['/']);
          this.store.dispatch(
            groupConversationsActions.deleteGroupConversation({ id: this.id }),
          );
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

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
