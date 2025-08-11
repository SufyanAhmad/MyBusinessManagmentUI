import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStorageUnitSuppliersComponent } from './edit-storage-unit-suppliers.component';

describe('EditStorageUnitSuppliersComponent', () => {
  let component: EditStorageUnitSuppliersComponent;
  let fixture: ComponentFixture<EditStorageUnitSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStorageUnitSuppliersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStorageUnitSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
