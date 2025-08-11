import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColdStoreShelfComponent } from './cold-store-shelf.component';

describe('ColdStoreShelfComponent', () => {
  let component: ColdStoreShelfComponent;
  let fixture: ComponentFixture<ColdStoreShelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColdStoreShelfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColdStoreShelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
