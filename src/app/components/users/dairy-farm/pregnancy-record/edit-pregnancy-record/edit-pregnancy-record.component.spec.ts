import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPregnancyRecordComponent } from './edit-pregnancy-record.component';

describe('EditPregnancyRecordComponent', () => {
  let component: EditPregnancyRecordComponent;
  let fixture: ComponentFixture<EditPregnancyRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPregnancyRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPregnancyRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
