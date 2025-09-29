import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminSettingComponent } from './super-admin-setting.component';

describe('SuperAdminSettingComponent', () => {
  let component: SuperAdminSettingComponent;
  let fixture: ComponentFixture<SuperAdminSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
