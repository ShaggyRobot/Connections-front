import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupConversationComponent } from './group-conversation.component';

describe('GroupConversationComponent', () => {
  let component: GroupConversationComponent;
  let fixture: ComponentFixture<GroupConversationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupConversationComponent]
    });
    fixture = TestBed.createComponent(GroupConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
