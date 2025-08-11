import { TestBed } from '@angular/core/testing';

import { PoultryFarmService } from './poultry-farm.service';

describe('PoultryFarmService', () => {
  let service: PoultryFarmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoultryFarmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
