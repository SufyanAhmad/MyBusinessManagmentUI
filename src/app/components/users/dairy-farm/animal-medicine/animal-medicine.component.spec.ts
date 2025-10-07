import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalMedicineComponent } from './animal-medicine.component';

describe('AnimalMedicineComponent', () => {
  let component: AnimalMedicineComponent;
  let fixture: ComponentFixture<AnimalMedicineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalMedicineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
