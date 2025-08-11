import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageUnitComponent } from './storage-unit.component';

describe('StorageUnitComponent', () => {
  let component: StorageUnitComponent;
  let fixture: ComponentFixture<StorageUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageUnitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
