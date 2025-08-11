import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColdStoreComponent } from './cold-store.component';

describe('ColdStoreComponent', () => {
  let component: ColdStoreComponent;
  let fixture: ComponentFixture<ColdStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColdStoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColdStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
