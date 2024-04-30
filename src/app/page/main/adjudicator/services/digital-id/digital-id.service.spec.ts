import { TestBed } from '@angular/core/testing';

import { DigitalIdService } from './digital-id.service';

describe('DigitalIdService', () => {
  let service: DigitalIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigitalIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
