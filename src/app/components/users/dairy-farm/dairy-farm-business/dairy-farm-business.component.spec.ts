import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DairyFarmBusinessComponent } from './dairy-farm-business.component';

describe('DairyFarmBusinessComponent', () => {
  let component: DairyFarmBusinessComponent;
  let fixture: ComponentFixture<DairyFarmBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DairyFarmBusinessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DairyFarmBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
