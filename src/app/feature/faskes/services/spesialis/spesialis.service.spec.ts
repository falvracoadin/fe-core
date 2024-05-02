import { TestBed } from '@angular/core/testing';

import { SpesialisService } from './spesialis.service';

describe('SpesialisService', () => {
  let service: SpesialisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpesialisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
