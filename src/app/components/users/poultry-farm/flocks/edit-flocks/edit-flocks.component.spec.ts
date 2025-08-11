import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFlocksComponent } from './edit-flocks.component';

describe('EditFlocksComponent', () => {
  let component: EditFlocksComponent;
  let fixture: ComponentFixture<EditFlocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFlocksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
