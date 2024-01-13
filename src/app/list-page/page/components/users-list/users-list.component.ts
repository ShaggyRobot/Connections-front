import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiAlertService } from '@taiga-ui/core';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  switchMap,
  takeUntil,
  throwError,
} from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TConversation, TUser } from 'src/app/list-page/models/list-page.model';
import { ListPageService } from 'src/app/list-page/services/list-page.service';
import { TimerService } from 'src/app/list-page/services/timer.service';
import { PersonalConversationService } from 'src/app/personal-conversation/services/personal-conversation.service';
import { selectHttpLoading } from 'src/app/store/selectors/httpLoading-selector';

export type TUserWithConversation = TUser & { conversation?: TConversation };

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit, OnDestroy {
  private destroy = new Subject<void>();
  public users: TUser[] = [];
  public userId: Observable<string> | null = null;

  usersWithConversations: TUserWithConversation[] = [];
  public usersSorted$: Array<TUser> = [];
  public loading$ = this.store.select(selectHttpLoading);
  readonly max = this.timerService.max;

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
    combineLatest([
      this.listPageService.usersData$,
      this.conversationsService.conversations$,
    ])
      .pipe(takeUntil(this.destroy))
      .subscribe(([usersData, conversations]) => {
        const usersWithConversations = usersData.users.map((item) => {
          const user: TUserWithConversation = { ...item };

          const userConversation = conversations.find(
            (item) => item.companionId === user.uid,
          );

          if (userConversation) {
            user['conversation'] = userConversation;
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

    if (!this.conversationsService.conversationsList) {
      this.conversationsService
        .getConversations()
        .pipe(takeUntil(this.destroy))
        .subscribe({
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

    if (!this.listPageService.users.length) {
      this.listPageService
        .getUsers()
        .pipe(takeUntil(this.destroy))
        .subscribe({
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

    this.userId = this.auth.uid$;
  }

  onRefresh() {
    this.disableRefresh = true;
    this.listPageService
      .getUsers(true)
      .pipe(
        switchMap(() => this.conversationsService.getConversations()),
        catchError((e) => throwError(() => e)),
      )
      .subscribe({
        error: (e) => {
          this.alerts
            .open(`${e.message}`, {
              label: '(╯°□°）╯︵ ┻━┻',
              status: 'error',
            })
            .subscribe();
        },
        complete: () => {
          this.disableRefresh = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
