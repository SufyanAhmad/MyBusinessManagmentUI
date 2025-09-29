import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  CustomerModel,
  EmployeeModel,
} from '../../../models/super-admin/super-admin-model';
import { catchError, map, merge, startWith, switchMap } from 'rxjs';
import { SuperAdminService } from '../../../services/super-admin-service/super-admin.service';
import { MasterService } from '../../../services/master-service/master.service';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../../services/account-service/account.service';
import { LoadingComponent } from '../../loading/loading.component';
import { DataNotFoundComponent } from '../../data-not-found/data-not-found.component';
import { ToastModule } from 'primeng/toast';
import { masterModal } from '../../../models/master-model/master-model';

@Component({
  selector: 'app-employees',
  imports: [
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    CommonModule,
    CheckboxModule,
    SelectModule,
    LoadingComponent,
    DataNotFoundComponent,
    ToastModule,
    RouterModule,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
  providers: [MessageService],
})
export class EmployeesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  customerList: EmployeeModel[] = [];
  dataSource!: MatTableDataSource<EmployeeModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  resultsLength: any = 0;
  searchKey: any = null;
  partyTypeId: any = null;
  isActive: any = null;
  status: string = 'Active';
  visible: boolean = false;
  addLoading: boolean = false;
  resetUerId: any = null;
  businessUnitId: any = null;
  addEmployeeModel!: FormGroup;
  EmployeeTypes: masterModal[] = [];
  BusinessUnits: masterModal[] = [];
  displayedColumns: string[] = [
    'name',
    'phone',
    'email',
    'business',
    'address',
    'endDate',
    'status',
  ];
  busUnitId: any = null;
  constructor(
    private formBuilder: FormBuilder,
    private superAdminService: SuperAdminService,
    private masterService: MasterService,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit() {
    this.busUnitId = localStorage.getItem('BS_businessUnitId');
    this.initForm();
    this.loadEmployeeTypes();
    this.loadBusinessUnits();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getEmployee();
    }, 0);
  }
  getEmployee() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.customerList = [];
    this.dataSource = new MatTableDataSource(this.customerList);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.customerList = [];
          this.dataSource = new MatTableDataSource(this.customerList);

          if (this.searchKey == null) {
            this.searchKey = null;
          }
          let data = {
            searchKey: this.searchKey,
            businessUnitId: this.businessUnitId,
            isActive: this.isActive,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.superAdminService.getEmployeeBySearchFilter(data).pipe(
            catchError((resp: any) => {
              if (resp.status == 401) {
                this.accountService.doLogout();
                this.router.navigateByUrl('/');
              }
              return resp;
            })
          );
        }),
        map((data) => {
          this.isRateLimitReached = data === null;
          if (data === null) {
            return [];
          }
          this.resultsLength = data.totalCount;
          return data;
        })
      )
      .subscribe(
        (data) => {
          this.customerList = [];
          for (let a = 0; a < data.list.length; a++) {
            let customer: EmployeeModel = {
              employeeId: data.list[a].employeeId,
              employeeType: data.list[a].employeeType,
              businessUnit: data.list[a].businessUnit,
              name: data.list[a].name,
              employeeTypeId: data.list[a].employeeTypeId,
              joiningDate: data.list[a].joiningDate,
              salary: data.list[a].salary,
              endDate: data.list[a].endDate,
              businessUnitId: data.list[a].businessUnitId,
              isActive: data.list[a].isActive,
            };
            this.customerList.push(customer);
          }
          this.dataSource = new MatTableDataSource(this.customerList);
          this.isLoadingResults = false;
        },
        (error) => {
          this.isLoadingResults = false;
          if (error.status == 401) {
            this.accountService.doLogout();
            this.router.navigateByUrl('/');
          }
        }
      );
  }
  addEmployee() {
    this.addLoading = true;
    this.superAdminService.addEmployee(this.addEmployeeModel.value).subscribe(
      (dt) => {
        this.addLoading = false;
        this.visible = false;
        this.getEmployee();
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Customer added successfully',
          life: 3000,
        });
      },
      (error) => {
        this.addLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  editEmployeeStatus(employeeId: any, status: any) {
    this.superAdminService.updateEmployeeStatus(employeeId, status).subscribe(
      (dt) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Employee status update successfully',
          life: 3000,
        });
      },
      (error) => {
        this.addLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  initForm() {
    this.addEmployeeModel = this.formBuilder.group({
      name: [null, [Validators.required]],
      employeeTypeId: [0, [Validators.required]],
      salary: [null],
      joiningDate: [null, [Validators.required]],
      endDate: [null],
      businessUnitId: ['', [Validators.required]],
    });
  }

  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
        this.getEmployee();
      }
    }
  }
  ResetFilter() {
    this.searchKey = null;
    this.businessUnitId = null;
    this.isActive = null;
    this.ngAfterViewInit();
  }
  loadEmployeeTypes() {
    this.masterService.getEmployeeTypes().subscribe(
      (res) => {
        var dt = res;
        this.EmployeeTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].employeeTypeId,
            type: dt[a].name,
          };
          this.EmployeeTypes.push(_data);
        }
      },

      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadBusinessUnits() {
    this.masterService.getBusinessUnitTypes().subscribe(
      (res) => {
        var dt = res;
        this.BusinessUnits = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].businessUnitId,
            type: dt[a].name,
          };
          this.BusinessUnits.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
}
