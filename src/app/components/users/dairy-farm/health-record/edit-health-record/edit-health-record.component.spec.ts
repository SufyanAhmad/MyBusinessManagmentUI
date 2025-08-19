import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHealthRecordComponent } from './edit-health-record.component';

describe('EditHealthRecordComponent', () => {
  let component: EditHealthRecordComponent;
  let fixture: ComponentFixture<EditHealthRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditHealthRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHealthRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
