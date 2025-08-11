import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEggProductionComponent } from './edit-egg-production.component';

describe('EditEggProductionComponent', () => {
  let component: EditEggProductionComponent;
  let fixture: ComponentFixture<EditEggProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEggProductionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEggProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
