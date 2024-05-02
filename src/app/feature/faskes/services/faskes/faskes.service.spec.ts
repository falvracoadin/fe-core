import { TestBed } from '@angular/core/testing';

import { FaskesService } from './faskes.service';

describe('FaskesService', () => {
  let service: FaskesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaskesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
