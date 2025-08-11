import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBankLedgerComponent } from './edit-bank-ledger.component';

describe('EditBankLedgerComponent', () => {
  let component: EditBankLedgerComponent;
  let fixture: ComponentFixture<EditBankLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBankLedgerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBankLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
