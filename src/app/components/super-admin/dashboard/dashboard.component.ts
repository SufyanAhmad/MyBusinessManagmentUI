import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { TotalCountsModel,BarGraphModel } from '../../../models/super-admin/super-admin-model';
import { SuperAdminService } from '../../../services/super-admin-service/super-admin.service';
import { AccountService } from '../../../services/account-service/account.service';

@Component({
  selector: 'app-dashboard',
  imports: [ChartModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  storageUnitChartData: any;
  chartData: any;
  chartOptions: any;
  TotalCounts: TotalCountsModel[] = [];
  loading: boolean = false;
  TotalCount: TotalCountsModel = {
    users: 0,
    customers: 0,
    suppliers: 0,
  };
   barGraph: BarGraphModel[] = [];
   barGraphModels: BarGraphModel[] = [];
   storageUnitLabels: string[] = [];
   storageUnitDataValues: number[] = [];
   dummy : any =5;
  constructor(
    private superAdminService: SuperAdminService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    
     this.chartData = {
       labels: ['Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Monthly Sales',
          backgroundColor: '#00B3B3',
           data: [65, 50, 50, 50],
        },
      ],
    };
    this.InitStorageUnitChart();
    this.getStorageUnitBarGraph();
    // this.storageUnitChartData?.update();
    this.loadTotalCounts();
   

    this.chartOptions = {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#000',
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            color: '#000',
          },
          grid: {
            display: false,
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }
  loadTotalCounts() {
    this.loading = true;
    this.superAdminService.getTotalCounts().subscribe(
      (dt) => {
        let data = dt;
        this.TotalCount = {
          users: data.users,
          customers: data.customers,
          suppliers: data.suppliers,
        };
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  getStorageUnitBarGraph() {
  this.loading = true;
  this.superAdminService.getStorageUnitBarGraph().subscribe(
    (dt) => {
      this.storageUnitLabels = [];
      this.storageUnitDataValues=[];
      this.storageUnitChartData.datasets[0].data = [];
      this.barGraphModels = [];
      for (let a = 0; a < dt.length; a++) {
        let barGraph: BarGraphModel = {
          monthName: dt[a].monthName,
          percentage: dt[a].percentage
        };
        this.storageUnitLabels.push(barGraph.monthName);
        this.storageUnitDataValues.push(barGraph.percentage);
      //   this.storageUnitChartData.labels.push(barGraph.monthName);
      //  this.storageUnitChartData.datasets[0].data.push(barGraph.percentage);
        this.barGraphModels.push(barGraph);
      }
      this.InitStorageUnitChart();
    },
    (error) => {
      if (error.status === 401) {
        this.accountService.doLogout();
      }
    }
  );
  }
  // Initialize the storage unit chart data
  InitStorageUnitChart(){
    this.storageUnitChartData = {
      labels: this.storageUnitLabels,
      datasets: [
        {
          label: 'Monthly Sales',
          backgroundColor: '#00B3B3',
          data: this.storageUnitDataValues,
        },
      ],
    };

  } 
}

