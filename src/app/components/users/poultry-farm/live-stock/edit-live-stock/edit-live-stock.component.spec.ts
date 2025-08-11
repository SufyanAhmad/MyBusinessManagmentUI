import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLiveStockComponent } from './edit-live-stock.component';

describe('EditLiveStockComponent', () => {
  let component: EditLiveStockComponent;
  let fixture: ComponentFixture<EditLiveStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLiveStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLiveStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
