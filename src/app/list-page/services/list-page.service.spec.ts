import { TestBed } from '@angular/core/testing';

import { ListPageService } from './list-page.service';

describe('ListPageService', () => {
  let service: ListPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
