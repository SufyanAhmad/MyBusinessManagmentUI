import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AccountService } from '../../../../services/account-service/account.service';
import { RouterLink } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, SelectModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(private accountService: AccountService) {}
  businessUnitName: any = '';
  busUnitId: any = null;
  chart: any;
  periodOptions = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ];
  selectedPeriod: 'weekly' | 'monthly' | 'yearly' = 'weekly';
  weeklyData = [1200, 1350, 1280, 1400, 1320, 1450, 1380];
  monthlyData = [
    5000, 5200, 4800, 5100, 5300, 5500, 5000, 5400, 5600, 5800, 6000, 6200,
  ];
  yearlyData = [60000, 65000, 62000, 70000, 68000];
  weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  monthlyLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  yearlyLabels = ['2019', '2020', '2021', '2022', '2023'];

  milkProductionChart: any;

  ngOnInit() {
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();
  }
  ngAfterViewInit() {
    this.initChart();
    this.initMilkProductionChart(this.selectedPeriod);
    this.initDailyTasksChart();
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
  // ------------------------------------------------------------

  // Called whenever dropdown value changes
  onPeriodChange(event: any) {
    this.initMilkProductionChart(this.selectedPeriod);
  }

  initMilkProductionChart(period: 'weekly' | 'monthly' | 'yearly') {
    const canvas = document.getElementById(
      'milkProductionChart'
    ) as HTMLCanvasElement;
    if (!canvas) return;

    const data =
      period === 'weekly'
        ? this.weeklyData
        : period === 'monthly'
        ? this.monthlyData
        : this.yearlyData;

    const labels =
      period === 'weekly'
        ? this.weeklyLabels
        : period === 'monthly'
        ? this.monthlyLabels
        : this.yearlyLabels;

    if (this.milkProductionChart) this.milkProductionChart.destroy();

    this.milkProductionChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Milk Production (Liters)',
            data: data,
            borderColor: '#ff6f61',
            backgroundColor: 'rgba(255, 111, 97, 0.2)',
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Liters' } },
        },
      },
    });
  }
  // Daily Tasks / Schedules Chart
  initDailyTasksChart() {
    const canvas = document.getElementById(
      'dailyTasksChart'
    ) as HTMLCanvasElement;
    if (!canvas) return;

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Milking', 'Feeding', 'Vaccination', 'Cleaning', 'Breeding'],
        datasets: [
          {
            label: 'Tasks Completed',
            data: [5, 5, 1, 3, 2],
            backgroundColor: '#1abc9c',
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Count' } },
        },
      },
    });
  }
}
