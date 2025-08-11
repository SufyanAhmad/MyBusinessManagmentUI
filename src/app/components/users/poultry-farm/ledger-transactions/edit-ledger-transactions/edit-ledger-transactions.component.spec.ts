import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLedgerTransactionsComponent } from './edit-ledger-transactions.component';

describe('EditLedgerTransactionsComponent', () => {
  let component: EditLedgerTransactionsComponent;
  let fixture: ComponentFixture<EditLedgerTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLedgerTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLedgerTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
