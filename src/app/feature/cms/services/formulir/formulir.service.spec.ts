import { TestBed } from '@angular/core/testing';

import { FormulirService } from './formulir.service';

describe('FormulirService', () => {
  let service: FormulirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormulirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
