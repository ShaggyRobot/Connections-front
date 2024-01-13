import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TuiAlertService } from '@taiga-ui/core';
import { Subject, takeUntil } from 'rxjs';
import { TConversation, TUser } from 'src/app/list-page/models/list-page.model';
import { TUserWithConversation } from 'src/app/list-page/page/components/users-list/users-list.component';
import { PersonalConversationService } from 'src/app/personal-conversation/services/personal-conversation.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnDestroy {
  @Input() user!: TUserWithConversation;
  @Input() conversation?: TConversation;
  private destroy = new Subject<void>();

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private personalConversationService: PersonalConversationService,
    private router: Router,
  ) {}

  createConversation() {
    this.personalConversationService
      .createConversation(this.user.uid)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: ({ conversationID }) => {
          this.router.navigate(['conversation', conversationID]);
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
