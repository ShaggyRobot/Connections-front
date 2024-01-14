import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  TuiButtonModule,
  TuiHintModule,
  TuiScrollbarComponent,
  TuiScrollbarModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiSurfaceModule } from '@taiga-ui/experimental';
import { TuiInputModule, TuiProgressModule } from '@taiga-ui/kit';
import {
  MessageComponent,
  TMessageWithName,
} from 'src/app/core/conversation/components/message/message.component';
import { selectHttpLoading } from 'src/app/store/selectors/httpLoading-selector';

@Component({
  standalone: true,
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  imports: [
    CommonModule,
    FormsModule,

    TuiSurfaceModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiHintModule,
    TuiButtonModule,
    TuiScrollbarModule,
    TuiProgressModule,

    RouterModule,

    MessageComponent,
  ],
})
export class ConversationComponent implements OnChanges {
  @Input() messages!: TMessageWithName[];
  @Input() timer!: number;
  @Input() timerMax!: number;
  @Input() countdown!: number;
  @Input() owned!: boolean;
  @Output() delete = new EventEmitter<void>();

  @Output() refresh = new EventEmitter<void>();
  @Output() outgoingMessage = new EventEmitter<string>();

  @ViewChild(TuiScrollbarComponent, { read: ElementRef })
  private readonly scrollBar?: ElementRef<HTMLElement>;

  public message: string = '';
  httpLoading = this.store.select(selectHttpLoading);

  constructor(
    private store: Store,
    private router: Router,
    ) {}

  onSend() {
    if (this.message) {
      this.outgoingMessage.emit(this.message);
      this.message = '';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const msgChange = changes['messages'];
    if (
      msgChange &&
      msgChange.currentValue.length !== msgChange.previousValue?.length
    ) {
      setTimeout(() => {
        this.scrollToBottom();
      });
    }
  }

  private scrollToBottom(): void {
    if (this.scrollBar) {
      this.scrollBar.nativeElement.scrollTop =
        this.scrollBar?.nativeElement.scrollHeight;
    }
  }

  onRefresh() {
    this.refresh.emit();
  }

  onDelete() {
    this.delete.emit();
  }

  onBack() {
    this.router.navigate(['..']);
  }
}
