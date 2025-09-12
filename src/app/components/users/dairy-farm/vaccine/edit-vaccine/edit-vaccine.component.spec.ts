import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVaccineComponent } from './edit-vaccine.component';

describe('EditVaccineComponent', () => {
  let component: EditVaccineComponent;
  let fixture: ComponentFixture<EditVaccineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVaccineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditVaccineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
