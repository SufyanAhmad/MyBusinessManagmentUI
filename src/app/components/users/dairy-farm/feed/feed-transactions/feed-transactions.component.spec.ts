import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedTransactionsComponent } from './feed-transactions.component';

describe('FeedTransactionsComponent', () => {
  let component: FeedTransactionsComponent;
  let fixture: ComponentFixture<FeedTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
