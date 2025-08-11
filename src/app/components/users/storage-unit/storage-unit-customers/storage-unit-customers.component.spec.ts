import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageUnitCustomersComponent } from './storage-unit-customers.component';

describe('StorageUnitCustomersComponent', () => {
  let component: StorageUnitCustomersComponent;
  let fixture: ComponentFixture<StorageUnitCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageUnitCustomersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageUnitCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
