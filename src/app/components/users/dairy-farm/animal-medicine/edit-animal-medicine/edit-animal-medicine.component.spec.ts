import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAnimalMedicineComponent } from './edit-animal-medicine.component';

describe('EditAnimalMedicineComponent', () => {
  let component: EditAnimalMedicineComponent;
  let fixture: ComponentFixture<EditAnimalMedicineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAnimalMedicineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAnimalMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
