import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStorageUnitLedgersComponent } from './edit-storage-unit-ledgers.component';

describe('EditStorageUnitLedgersComponent', () => {
  let component: EditStorageUnitLedgersComponent;
  let fixture: ComponentFixture<EditStorageUnitLedgersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStorageUnitLedgersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStorageUnitLedgersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
