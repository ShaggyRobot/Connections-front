import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TuiLinkModule } from '@taiga-ui/core';
import { TMessage } from 'src/app/store/state.model';

export type TMessageWithName = TMessage & { name: string; owner: boolean };

@Component({
  standalone: true,
  selector: 'standalone-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  imports: [CommonModule, TuiLinkModule],
})
export class MessageComponent {
  @Input() message!: TMessageWithName;

  testForLink(text: string): boolean {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
  }
}
