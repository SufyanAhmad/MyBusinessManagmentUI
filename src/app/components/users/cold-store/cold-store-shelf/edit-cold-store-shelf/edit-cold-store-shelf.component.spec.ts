import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditColdStoreShelfComponent } from './edit-cold-store-shelf.component';

describe('EditColdStoreShelfComponent', () => {
  let component: EditColdStoreShelfComponent;
  let fixture: ComponentFixture<EditColdStoreShelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditColdStoreShelfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditColdStoreShelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
