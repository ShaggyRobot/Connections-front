import { TestBed } from '@angular/core/testing';

import { PersonalConversationService } from './personal-conversation.service';

describe('PersonalConversationService', () => {
  let service: PersonalConversationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalConversationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
