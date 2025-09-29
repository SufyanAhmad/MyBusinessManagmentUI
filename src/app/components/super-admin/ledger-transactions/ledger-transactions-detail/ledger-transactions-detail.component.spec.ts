import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerTransactionsDetailComponent } from './ledger-transactions-detail.component';

describe('LedgerTransactionsDetailComponent', () => {
  let component: LedgerTransactionsDetailComponent;
  let fixture: ComponentFixture<LedgerTransactionsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedgerTransactionsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LedgerTransactionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
