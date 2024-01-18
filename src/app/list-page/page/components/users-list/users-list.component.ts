import { AsyncPipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  TuiAlertService,
  TuiButtonModule,
  TuiScrollbarModule,
} from '@taiga-ui/core';
import { TuiSurfaceModule } from '@taiga-ui/experimental';
import { TuiProgressModule } from '@taiga-ui/kit';
import { Observable, Subject, combineLatest, merge, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TConversation, TUser } from 'src/app/list-page/models/list-page.model';
import { UserComponent } from 'src/app/list-page/page/components/user/user.component';
import { ListPageService } from 'src/app/list-page/services/list-page.service';
import { TimerService } from 'src/app/list-page/services/timer.service';
import { PersonalConversationService } from 'src/app/personal-conversation/services/personal-conversation.service';
import { conversationsListActions } from 'src/app/store/actions/conversations-list-actions';
import { usersListActions } from 'src/app/store/actions/users-list-actions';
import {
  selectConversationsList,
  selectConversationsListError,
} from 'src/app/store/selectors/conversations-list-selectors';
import { selectHttpLoading } from 'src/app/store/selectors/httpLoading-selector';
import {
  selectUsersList,
  selectUsersListError,
} from 'src/app/store/selectors/users-list-selectors';

export type TUserWithConversation = TUser & { conversation?: TConversation };

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    UserComponent,
    TuiScrollbarModule,
    TuiProgressModule,
    TuiButtonModule,
    TuiSurfaceModule,
  ],
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit, OnDestroy {
  private destroy = new Subject<void>();

  public users: TUser[] = [];

  public conversations: TConversation[] = [];

  public userId: Observable<string> | null = null;

  usersWithConversations: TUserWithConversation[] = [];

  public usersSorted$: Array<TUser> = [];

  public loading$ = this.store.select(selectHttpLoading);

  readonly max = this.timerService.max;

  private usersList$ = this.store.select(selectUsersList());

  private conversationsList$ = this.store.select(selectConversationsList());

  disableRefresh = false;

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    public listPageService: ListPageService,
    public conversationsService: PersonalConversationService,
    private store: Store,
    public timerService: TimerService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.usersList$.pipe(takeUntil(this.destroy)).subscribe((list) => {
      if (!list.length) {
        this.store.dispatch(usersListActions.getUsersList({}));
      }

      this.users = list;
    });

    this.conversationsList$.pipe(takeUntil(this.destroy)).subscribe((list) => {
      if (!list.length) {
        this.store.dispatch(conversationsListActions.getConversationsList());
      }

      this.conversations = list;
    });

    combineLatest([this.usersList$, this.conversationsList$])
      .pipe(takeUntil(this.destroy))
      .subscribe(([users, conversations]) => {
        const usersWithConversations = users.map((item) => {
          const user: TUserWithConversation = { ...item };

          const userConversation = conversations.find(
            (conversation) => conversation.companionId === user.uid,
          );

          if (userConversation) {
            user.conversation = userConversation;
          }

          return user;
        });

        this.usersWithConversations = usersWithConversations.sort((a, b) => {
          const conversationA = conversations.find(
            (item) => item.companionId === a.uid,
          );
          const conversationB = conversations.find(
            (item) => item.companionId === b.uid,
          );
          return conversationA ? -1 : conversationB ? 1 : 0;
        });
      });

    merge(
      this.store.select(selectUsersListError()),
      this.store.select(selectConversationsListError()),
    )
      .pipe(takeUntil(this.destroy))
      .subscribe({
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

    this.userId = this.auth.uid$;
  }

  onRefresh() {
    this.store.dispatch(usersListActions.getUsersList({ withTimer: true }));
    this.store.dispatch(conversationsListActions.getConversationsList());
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
