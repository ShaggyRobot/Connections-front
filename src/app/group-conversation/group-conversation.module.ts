import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupConversationRoutingModule } from './group-conversation-routing.module';
import { GroupConversationComponent } from './page/group-conversation/group-conversation.component';
import {
  TuiButtonModule,
  TuiDialogModule,

} from '@taiga-ui/core';
import { ConversationComponent } from 'src/app/core/conversation/conversation.component';

@NgModule({
  declarations: [GroupConversationComponent],
  imports: [
    CommonModule,
    GroupConversationRoutingModule,
    ConversationComponent,

    TuiDialogModule,
    TuiButtonModule,
  ],
})
export class GroupConversationModule {}
