import { TestBed } from '@angular/core/testing';

import { AnomaliDataService } from './anomali-data.service';

describe('AnomaliDataService', () => {
  let service: AnomaliDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnomaliDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
