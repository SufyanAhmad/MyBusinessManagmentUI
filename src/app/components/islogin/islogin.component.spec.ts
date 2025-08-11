import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsloginComponent } from './islogin.component';

describe('IsloginComponent', () => {
  let component: IsloginComponent;
  let fixture: ComponentFixture<IsloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsloginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
