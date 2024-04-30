import { TestBed } from '@angular/core/testing';

import { KependudukanService } from './kependudukan.service';

describe('KependudukanService', () => {
  let service: KependudukanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KependudukanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
