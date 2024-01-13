import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalConversationComponent } from 'src/app/personal-conversation/page/personal-conversation/personal-conversation.component';

const routes: Routes = [{
  path: '',
  component: PersonalConversationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalConversationRoutingModule { }
