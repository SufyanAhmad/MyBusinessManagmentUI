import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansesComponent } from './expanses.component';

describe('ExpansesComponent', () => {
  let component: ExpansesComponent;
  let fixture: ComponentFixture<ExpansesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpansesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpansesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
