import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBreedComponent } from './edit-breed.component';

describe('EditBreedComponent', () => {
  let component: EditBreedComponent;
  let fixture: ComponentFixture<EditBreedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBreedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBreedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
