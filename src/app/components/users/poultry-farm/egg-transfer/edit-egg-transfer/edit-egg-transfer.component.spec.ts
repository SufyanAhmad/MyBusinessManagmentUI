import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEggTransferComponent } from './edit-egg-transfer.component';

describe('EditEggTransferComponent', () => {
  let component: EditEggTransferComponent;
  let fixture: ComponentFixture<EditEggTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEggTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEggTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
