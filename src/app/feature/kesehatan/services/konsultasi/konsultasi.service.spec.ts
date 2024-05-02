import { TestBed } from '@angular/core/testing';

import { KonsultasiService } from './konsultasi.service';

describe('KonsultasiService', () => {
  let service: KonsultasiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KonsultasiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
