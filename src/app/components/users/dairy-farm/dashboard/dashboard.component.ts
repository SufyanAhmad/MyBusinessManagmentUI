import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AccountService } from '../../../../services/account-service/account.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(private accountService: AccountService) {}
  businessUnitName: any = '';
  busUnitId: any = null;
  chart: any;
  ngOnInit() {
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();
  }
  // render chart after component view exists
  ngAfterViewInit() {
    this.initChart();
  }

  // destroy existing chart before re-creating (prevents duplication)
  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  initChart() {
    const canvas = document.getElementById(
      'lactationChart'
    ) as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [
          {
            label: 'No. of Lactations',
            data: [157, 19, 71, 12, 3],
            backgroundColor: '#4079b0',
            borderRadius: 8,
            yAxisID: 'y',
          },
          {
            label: 'Percentage',
            data: [65, 25, 45, 15, 5],
            borderColor: '#3da35d',
            backgroundColor: 'transparent',
            type: 'line',
            tension: 0.3,
            pointBackgroundColor: '#3da35d',
            borderWidth: 2,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom' },
          title: { display: true, text: 'Lactation Graph', font: { size: 18 } },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'No. of Animals' },
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'Percentage' },
          },
        },
      },
    });
  }
}
