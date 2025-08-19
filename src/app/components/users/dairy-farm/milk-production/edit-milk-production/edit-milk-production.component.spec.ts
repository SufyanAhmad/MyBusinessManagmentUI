import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMilkProductionComponent } from './edit-milk-production.component';

describe('EditMilkProductionComponent', () => {
  let component: EditMilkProductionComponent;
  let fixture: ComponentFixture<EditMilkProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMilkProductionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMilkProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
