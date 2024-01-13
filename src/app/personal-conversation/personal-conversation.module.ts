import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalConversationRoutingModule } from './personal-conversation-routing.module';
import { PersonalConversationComponent } from './page/personal-conversation/personal-conversation.component';
import { ConversationComponent } from 'src/app/core/conversation/conversation.component';
import { TuiButtonModule, TuiDialogModule } from '@taiga-ui/core';

@NgModule({
  declarations: [PersonalConversationComponent],
  imports: [
    CommonModule,
    PersonalConversationRoutingModule,
    ConversationComponent,

    TuiDialogModule,
    TuiButtonModule,
  ],
})
export class PersonalConversationModule {}
