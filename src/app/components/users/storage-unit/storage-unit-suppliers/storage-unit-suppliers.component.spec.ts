import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageUnitSuppliersComponent } from './storage-unit-suppliers.component';

describe('StorageUnitSuppliersComponent', () => {
  let component: StorageUnitSuppliersComponent;
  let fixture: ComponentFixture<StorageUnitSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageUnitSuppliersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageUnitSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
