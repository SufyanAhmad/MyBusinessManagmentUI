import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalesComponent } from './edit-sales.component';

describe('EditSalesComponent', () => {
  let component: EditSalesComponent;
  let fixture: ComponentFixture<EditSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
