import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFeedConsumptionComponent } from './edit-feed-consumption.component';

describe('EditFeedConsumptionComponent', () => {
  let component: EditFeedConsumptionComponent;
  let fixture: ComponentFixture<EditFeedConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFeedConsumptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFeedConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
