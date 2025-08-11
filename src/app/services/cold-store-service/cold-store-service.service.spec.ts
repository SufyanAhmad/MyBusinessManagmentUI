import { TestBed } from '@angular/core/testing';

import { ColdStoreServiceService } from './cold-store-service.service';

describe('ColdStoreServiceService', () => {
  let service: ColdStoreServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColdStoreServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
