import { TestBed } from '@angular/core/testing';

import { GroupConversationService } from './group-conversation.service';

describe('GroupConversationService', () => {
  let service: GroupConversationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupConversationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
