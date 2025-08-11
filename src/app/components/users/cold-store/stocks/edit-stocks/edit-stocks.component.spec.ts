import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStocksComponent } from './edit-stocks.component';

describe('EditStocksComponent', () => {
  let component: EditStocksComponent;
  let fixture: ComponentFixture<EditStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStocksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
