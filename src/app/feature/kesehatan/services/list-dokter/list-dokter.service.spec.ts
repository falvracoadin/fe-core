import { TestBed } from '@angular/core/testing';

import { ListDokterService } from './list-dokter.service';

describe('ListDokterService', () => {
  let service: ListDokterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListDokterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
