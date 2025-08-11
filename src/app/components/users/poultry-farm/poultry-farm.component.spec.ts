import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoultryFarmComponent } from './poultry-farm.component';

describe('PoultryFarmComponent', () => {
  let component: PoultryFarmComponent;
  let fixture: ComponentFixture<PoultryFarmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoultryFarmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoultryFarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
