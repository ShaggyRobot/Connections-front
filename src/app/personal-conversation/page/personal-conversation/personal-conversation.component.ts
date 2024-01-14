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
import { ListPageService } from 'src/app/list-page/services/list-page.service';
import { TimerService } from 'src/app/list-page/services/timer.service';
import { PersonalConversationService } from 'src/app/personal-conversation/services/personal-conversation.service';
import { personalConversationsActions } from 'src/app/store/actions/personal-conversation-actions';
import { selectHttpLoading } from 'src/app/store/selectors/httpLoading-selector';
import {
  selectPersonalConversation,
  selectPersonalConversationError,
} from 'src/app/store/selectors/personal-conversation-selectors';
import { TMessage } from 'src/app/store/state.model';

@Component({
  standalone: true,

  imports: [AsyncPipe, TuiDialogModule, TuiButtonModule, ConversationComponent],

  selector: 'app-personal-conversation',
  templateUrl: './personal-conversation.component.html',
  styleUrls: ['./personal-conversation.component.scss'],
})
export class PersonalConversationComponent implements OnInit, OnDestroy {
  public id: string = '';
  private destroy = new Subject<void>();
  public conversation$: Observable<TMessage[]> = new Observable();

  public messagesWithNames: TMessageWithName[] = [];

  private error$ = this.store.select(selectPersonalConversationError);

  public dialogOpen = false;
  public httpLoading = this.store.select(selectHttpLoading);

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    public timer: TimerService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private listPageService: ListPageService,
    private auth: AuthService,
    private personalConversationsService: PersonalConversationService,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy)).subscribe((params) => {
      this.id = params['id'];

      this.store.dispatch(
        personalConversationsActions.getPersonalConversations({
          id: params['id'],
        }),
      );

      if (!this.listPageService.users.length) {
        this.listPageService
          .getUsers()
          .pipe(takeUntil(this.destroy))
          .subscribe();
      }

      combineLatest([
        this.store.select(selectPersonalConversation(this.id)),
        this.auth.uid$,
        this.listPageService.usersData$,
      ])
        .pipe(takeUntil(this.destroy))
        .subscribe(([conversation, uid, usersData]) => {
          const messages = conversation.map(
            ({ authorID, createdAt, message }): TMessageWithName => ({
              authorID,
              createdAt,
              message,
              name: usersData.users.find((user) => user.uid === authorID)
                ?.name!,
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
      personalConversationsActions.sendPersonalConversationMessage({
        conversationId: this.id,
        message,
      }),
    );
  }

  onRefresh() {
    this.store.dispatch(
      personalConversationsActions.getPersonalConversations({
        id: this.id,
        withTimer: true,
      }),
    );
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  onDelete() {
    this.personalConversationsService.deleteConversation(this.id).subscribe({
      next: () => {
        this.store.dispatch(
          personalConversationsActions.deletePersonalConversation({
            id: this.id,
          }),
        );
        this.router.navigate(['..']);
      },

      error: (e) => {
        if (e) {
          this.alerts
            .open(`${e.message}`, {
              label: '(╯°□°）╯︵ ┻━┻',
              status: 'error',
            })
            .subscribe();

          this.router.navigate(['..']);
        }
      },
    });
  }
}
