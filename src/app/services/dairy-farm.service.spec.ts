import { TestBed } from '@angular/core/testing';

import { DairyFarmService } from './dairy-farm.service';

describe('DairyFarmService', () => {
  let service: DairyFarmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DairyFarmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
