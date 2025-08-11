import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStorageUnitCustomersComponent } from './edit-storage-unit-customers.component';

describe('EditStorageUnitCustomersComponent', () => {
  let component: EditStorageUnitCustomersComponent;
  let fixture: ComponentFixture<EditStorageUnitCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStorageUnitCustomersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStorageUnitCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
