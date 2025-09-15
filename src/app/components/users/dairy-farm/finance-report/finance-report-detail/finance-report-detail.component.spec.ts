import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceReportDetailComponent } from './finance-report-detail.component';

describe('FinanceReportDetailComponent', () => {
  let component: FinanceReportDetailComponent;
  let fixture: ComponentFixture<FinanceReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceReportDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
