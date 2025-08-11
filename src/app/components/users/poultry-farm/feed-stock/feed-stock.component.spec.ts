import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedStockComponent } from './feed-stock.component';

describe('FeedStockComponent', () => {
  let component: FeedStockComponent;
  let fixture: ComponentFixture<FeedStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
