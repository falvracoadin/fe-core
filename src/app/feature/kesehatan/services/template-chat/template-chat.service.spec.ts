import { TestBed } from '@angular/core/testing';

import { TemplateChatService } from './template-chat.service';

describe('TemplateChatService', () => {
  let service: TemplateChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
