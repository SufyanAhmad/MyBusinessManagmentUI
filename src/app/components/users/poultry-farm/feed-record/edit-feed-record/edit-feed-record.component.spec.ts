import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFeedRecordComponent } from './edit-feed-record.component';

describe('EditFeedRecordComponent', () => {
  let component: EditFeedRecordComponent;
  let fixture: ComponentFixture<EditFeedRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFeedRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFeedRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
