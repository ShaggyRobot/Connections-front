import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupConversationComponent } from 'src/app/group-conversation/page/group-conversation/group-conversation.component';

const routes: Routes = [{
  path: '',
  component: GroupConversationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupConversationRoutingModule { }
