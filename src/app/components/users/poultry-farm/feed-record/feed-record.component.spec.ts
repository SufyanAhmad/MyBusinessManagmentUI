import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedRecordComponent } from './feed-record.component';

describe('FeedRecordComponent', () => {
  let component: FeedRecordComponent;
  let fixture: ComponentFixture<FeedRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
