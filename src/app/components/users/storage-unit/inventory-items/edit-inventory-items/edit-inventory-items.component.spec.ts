import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInventoryItemsComponent } from './edit-inventory-items.component';

describe('EditInventoryItemsComponent', () => {
  let component: EditInventoryItemsComponent;
  let fixture: ComponentFixture<EditInventoryItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInventoryItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInventoryItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
