import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExpansesComponent } from './edit-expanses.component';

describe('EditExpansesComponent', () => {
  let component: EditExpansesComponent;
  let fixture: ComponentFixture<EditExpansesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExpansesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExpansesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
