import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageUnitLedgersComponent } from './storage-unit-ledgers.component';

describe('StorageUnitLedgersComponent', () => {
  let component: StorageUnitLedgersComponent;
  let fixture: ComponentFixture<StorageUnitLedgersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageUnitLedgersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageUnitLedgersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
