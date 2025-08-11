import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EggTransferComponent } from './egg-transfer.component';

describe('EggTransferComponent', () => {
  let component: EggTransferComponent;
  let fixture: ComponentFixture<EggTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EggTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EggTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
