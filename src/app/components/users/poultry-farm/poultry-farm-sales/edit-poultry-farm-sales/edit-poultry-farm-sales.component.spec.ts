import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPoultryFarmSalesComponent } from './edit-poultry-farm-sales.component';

describe('EditPoultryFarmSalesComponent', () => {
  let component: EditPoultryFarmSalesComponent;
  let fixture: ComponentFixture<EditPoultryFarmSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPoultryFarmSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPoultryFarmSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
