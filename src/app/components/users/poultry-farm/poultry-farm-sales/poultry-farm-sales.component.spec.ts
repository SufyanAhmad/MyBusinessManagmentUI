import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoultryFarmSalesComponent } from './poultry-farm-sales.component';

describe('PoultryFarmSalesComponent', () => {
  let component: PoultryFarmSalesComponent;
  let fixture: ComponentFixture<PoultryFarmSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoultryFarmSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoultryFarmSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
