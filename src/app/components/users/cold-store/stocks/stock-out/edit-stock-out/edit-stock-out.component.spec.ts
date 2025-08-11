import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStockOutComponent } from './edit-stock-out.component';

describe('EditStockOutComponent', () => {
  let component: EditStockOutComponent;
  let fixture: ComponentFixture<EditStockOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStockOutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStockOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
