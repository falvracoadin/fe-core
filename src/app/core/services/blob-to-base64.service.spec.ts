import { TestBed } from '@angular/core/testing';

import { BlobToBase64Service } from './blob-to-base64.service';

describe('BlobToBase64Service', () => {
  let service: BlobToBase64Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlobToBase64Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
