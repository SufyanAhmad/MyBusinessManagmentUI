import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
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
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CustomerModel } from '../../../models/super-admin/super-admin-model';
import { catchError, filter, map, merge, startWith, switchMap } from 'rxjs';
import { SuperAdminService } from '../../../services/super-admin-service/super-admin.service';
import { MasterService } from '../../../services/master-service/master.service';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../../services/account-service/account.service';
import { LoadingComponent } from '../../loading/loading.component';
import { DataNotFoundComponent } from '../../data-not-found/data-not-found.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-suppliers',
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
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
  providers: [MessageService],
})
export class SuppliersComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() editRouteBase: string = '/superAdmin/suppliers/edit';
  customerList: CustomerModel[] = [];
  dataSource!: MatTableDataSource<CustomerModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  resultsLength: any = 0;
  searchKey: any = null;
  partyTypeId: any = 1;
  isActive: any = null;
  visible: boolean = false;
  addLoading: boolean = false;
   phoneValidation = '^03[0-9]{2}-[0-9]{7}$';
  emailValidation = '^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\\.[a-zA-Z0-9]{2,}$';
  addSupplierModel!: FormGroup;
  businessUnitName: any = '';
  busUnitId: any = null;
  checkRouteUrl: string = '';
  displayedColumns: string[] = ['name', 'phone', 'email', 'address', 'status'];

  constructor(
    private formBuilder: FormBuilder,
    private superAdminService: SuperAdminService,
    private masterService: MasterService,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit() {
    this.busUnitId = localStorage.getItem('DF_businessUnitId');
    this.businessUnitName = localStorage.getItem('DF_businessUnit_Name');
    this.checkRouteUrl = this.router.url;
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRouteUrl = event.url;
      });
    this.initForm();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getSuppliers();
    }, 0);
  }
  getSuppliers() {
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
            partyTypeId: this.partyTypeId,
            isActive: this.isActive,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.superAdminService
            .getCustomerSupplierBySearchFilter(data)
            .pipe(
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
            let customer: CustomerModel = {
              partyId: data.list[a].partyId,
              name: data.list[a].name,
              phone: data.list[a].phone,
              email: data.list[a].email,
              address: data.list[a].address,
              isActive: data.list[a].isActive,
              partyTypeId: data.list[a].partyTypeId,
              partyType: data.list[a].partyType,
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
  addSupplier() {
    this.addLoading = true;
    this.superAdminService
      .addCustomerSupplier(this.addSupplierModel.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          this.getSuppliers();
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Supplier added successfully',
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
  editSupplierStatus(supplierId: any, status: any) {
    this.superAdminService
      .updateCustomerSupplierStatus(supplierId, status)
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Supplier status update successfully',
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
    this.addSupplierModel = this.formBuilder.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.pattern(this.emailValidation)]],
      phone: [null, [Validators.pattern(this.phoneValidation)]],
      address: [null],
      partyTypeId: [1],
    });
  }
  onEditSupplier(partyId: number) {
    this.router.navigate([this.editRouteBase, partyId]);
  }
  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
        this.getSuppliers();
      }
    }
  }
  ResetFilter() {
    this.searchKey = null;
    this.ngAfterViewInit();
  }
}
