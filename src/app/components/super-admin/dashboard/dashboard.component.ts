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
  usersChartData: any; 
  suppliersChartData: any; 
  customersChartData: any;
  chartData: any;
  chartOptions: any;
  TotalCounts: TotalCountsModel[] = [];
  loading: boolean = false;
  isAdminExit: boolean = false;
  TotalCount: TotalCountsModel = {
    users: 0,
    customers: 0,
    suppliers: 0,
  };
   barGraph: BarGraphModel[] = [];
   barGraphModels: BarGraphModel[] = [];
   usersLabels: string[] = [];
   usersDataValues: number[] = [];
   suppliersLabels: string[] = [];
   suppliersDataValues: number[] = [];
   customersLabels: string[] = [];
   customersDataValues: number[] = [];
   dummy : any =5;
  constructor(
    private superAdminService: SuperAdminService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
     if (this.accountService.getRoles().includes("Admin")) {
      this.isAdminExit = true;
    }
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
    this.InitDairyFarmUsersChart();
    this.InitDairyFarmSuppliersChart();
    this.InitDairyFarmCustomersChart();
    this.getDairyFarmUsersBarGraph();
    this.getDairyFarmSuppliersBarGraph();
    this.getDairyFarmCustomersBarGraph();
    this.loadTotalCounts();
  this.chartOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      type: 'category',
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
        stepSize: 1,   // ✅ force step of 1
        callback: function (value:any) {
          return value; // show only integers
        },
      },
      grid: {
        display: false,
      },
      beginAtZero: true, // ✅ start at 0
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
        debugger
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
  getDairyFarmUsersBarGraph() {
  this.loading = true;
  this.superAdminService.getUsersBarGraph().subscribe(
    (dt) => {
      this.usersLabels = [];
      this.usersDataValues=[];
      this.usersChartData.datasets[0].data = [];
      this.barGraphModels = [];
      for (let a = 0; a < dt.length; a++) {
        let barGraph: BarGraphModel = {
          monthName: dt[a].monthName,
          percentage: dt[a].count
        };
        this.usersLabels.push(barGraph.monthName);
        this.usersDataValues.push(barGraph.percentage);
        this.barGraphModels.push(barGraph);
      }
      this.InitDairyFarmUsersChart();
    },
    (error) => {
      if (error.status === 401) {
        this.accountService.doLogout();
      }
    }
  );
  }
  getDairyFarmSuppliersBarGraph() {
  this.loading = true;
  this.superAdminService.getSuppliersBarGraph().subscribe(
    (dt) => {
      this.suppliersLabels = [];
      this.suppliersDataValues=[];
      this.suppliersChartData.datasets[0].data = [];
      this.barGraphModels = [];
      for (let a = 0; a < dt.length; a++) {
        let barGraph: BarGraphModel = {
          monthName: dt[a].monthName,
          percentage: dt[a].count
        };
        this.suppliersLabels.push(barGraph.monthName);
        this.suppliersDataValues.push(barGraph.percentage);
        this.barGraphModels.push(barGraph);
      }
      this.InitDairyFarmSuppliersChart();
    },
    (error) => {
      if (error.status === 401) {
        this.accountService.doLogout();
      }
    }
  );
  }
  getDairyFarmCustomersBarGraph() {
  this.loading = true;
  this.superAdminService.getCustomersBarGraph().subscribe(
    (dt) => {
      this.customersLabels = [];
      this.customersDataValues=[];
      this.customersChartData.datasets[0].data = [];
      this.barGraphModels = [];
      for (let a = 0; a < dt.length; a++) {
        let barGraph: BarGraphModel = {
          monthName: dt[a].monthName,
          percentage: dt[a].count
        };
        this.customersLabels.push(barGraph.monthName);
        this.customersDataValues.push(barGraph.percentage);
        this.barGraphModels.push(barGraph);
      }
      this.InitDairyFarmCustomersChart();
    },
    (error) => {
      if (error.status === 401) {
        this.accountService.doLogout();
      }
    }
  );
  }
  // Initialize the storage unit chart data
  InitDairyFarmUsersChart(){
    this.usersChartData = {
      labels: this.usersLabels,
      datasets: [
        {
          label: 'Monthly Users',
          backgroundColor: '#e47c1c',
          data: this.usersDataValues,
        },
      ],
    };

  } 
  InitDairyFarmSuppliersChart(){
    this.suppliersChartData = {
      labels: this.suppliersLabels,
      datasets: [
        {
          label: 'Monthly Suppliers',
          backgroundColor: '#0d77bc',
          data: this.suppliersDataValues,
        },
      ],
    };

  } 
  InitDairyFarmCustomersChart(){
    this.customersChartData = {
      labels: this.customersLabels,
      datasets: [
        {
          label: 'Monthly Customers',
          backgroundColor: '#338c8e',
          data: this.customersDataValues,
        },
      ],
    };

  } 
}

