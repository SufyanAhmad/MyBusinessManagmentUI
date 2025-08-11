import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CustomerPaymentModel } from '../../../../models/super-admin/super-admin-model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { masterModal } from '../../../../models/master-model/master-model';
import { SuperAdminService } from '../../../../services/super-admin-service/super-admin.service';
import { MasterService } from '../../../../services/master-service/master.service';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../../services/account-service/account.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { LoadingComponent } from '../../../loading/loading.component';
import { DataNotFoundComponent } from '../../../data-not-found/data-not-found.component';
import { ToastModule } from 'primeng/toast';
import { catchError, map, merge, startWith, switchMap } from 'rxjs';
@Component({
  selector: 'app-ledger-transactions',
  imports: [
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
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
  templateUrl: './ledger-transactions.component.html',
  styleUrl: './ledger-transactions.component.scss',
  providers: [MessageService],
})
export class LedgerTransactionsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  customerPaymentList: CustomerPaymentModel[] = [];
  dataSource!: MatTableDataSource<CustomerPaymentModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  resultsLength: any = 0;
  searchKey: any = null;
  partyTypeId: any = 0;
  isActive: any = null;
  openingBalance: any = 0;
  status: string = 'Active';
  visible: boolean = false;
  addLoading: boolean = false;
  resetUerId: any = null;
  totalCredit: number = 0;
  totalDebit: number = 0;
  to: any = null;
  from: any = null;
  partyId: any = null;
  businessUnitName: any = '';
  addCustomerPaymentModel!: FormGroup;
  _businessUnitId: any = null;
  partiesTypes: masterModal[] = [];
  displayedColumns: string[] = [
    'reference',
    'name',
    'product',
    'date',
    'credit',
    'debit',
    'remBalance',
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
    this._businessUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');

    this.initForm();
    this.loadPartiesTypes();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getCustomersPayment();
    }, 0);
  }

  getCustomersPayment() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.customerPaymentList = [];
    this.dataSource = new MatTableDataSource(this.customerPaymentList);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.customerPaymentList = [];
          this.dataSource = new MatTableDataSource(this.customerPaymentList);

          if (this.searchKey == null) {
            this.searchKey = null;
          }
          if (this.to == '' || this.from == '') {
            this.to = null;
            this.from = null;
          }
          let data = {
            searchKey: this.searchKey,
            clientId: this.partyId,
            businessUnitId: this._businessUnitId,
            // isActive: this.isActive,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
            from: this.from,
            to: this.to,
          };
          return this.superAdminService
            .getCustomerPaymentBySearchFilter(data)
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
          this.openingBalance = data.openingBalance;
          this.customerPaymentList = [];

          let balance = 0;
          let totalCredit = 0;
          let totalDebit = 0;

          for (let a = 0; a < data.list.length; a++) {
            const item = data.list[a];
            if (item.isCredit) {
              totalCredit += item.totalPayment;
            } else {
              totalDebit += item.totalPayment;
            }
            let customer: CustomerPaymentModel = {
              paymentId: data.list[a].paymentId,
              clientId: data.list[a].clientId,
              client: data.list[a].client,
              productTypeId: data.list[a].productTypeId,
              productType: data.list[a].productType,
              date: data.list[a].date,
              isCredit: data.list[a].isCredit,
              totalPayment: data.list[a].totalPayment,
              paidAmount: data.list[a].paidAmount,
              remainingBalance: data.list[a].isCredit
                ? balance + data.list[a].totalPayment
                : balance - data.list[a].totalPayment,
              reference: data.list[a].reference,
            };
            balance = Number(customer.remainingBalance);
            this.customerPaymentList.push(customer);
          }
          this.totalCredit = totalCredit;
          this.totalDebit = totalDebit;
          this.dataSource = new MatTableDataSource(this.customerPaymentList);
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

  AddCustomerPayment() {
    this.addLoading = true;
    this.superAdminService

      .addCustomerPayment(this.addCustomerPaymentModel.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          this.getCustomersPayment();
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Customer payment added successfully',
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
  editCustomerStatus(customerId: any, status: any) {
    this.superAdminService
      .updateCustomerSupplierStatus(customerId, status)
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Customer status update successfully',
            life: 3000,
          });
          // this.getSuppliers();
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
    this.addCustomerPaymentModel = this.formBuilder.group({
      businessUnitId:[this._businessUnitId],
      billNo: [null],
      creditClientId: [null],
      debitClientId: [null],
      paymentDate: [
        new Date().toISOString().substring(0, 10),
        [Validators.required],
      ],
      creditAmount: [null],
      debitAmount: [null],
      note: [''],
      paymentTypeId: ['', [Validators.required]],
    });

    this.addCustomerPaymentModel
      .get('creditAmount')
      ?.valueChanges.subscribe((value) => {
        this.addCustomerPaymentModel
          .get('debitAmount')
          ?.setValue(value, { emitEvent: false });
      });
  }

  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
        this.getCustomersPayment();
      }
    }
  }
  ResetFilter() {
    this.searchKey = null;
    this.partyId = null;
    this.from = null;
    this.to = null;
    this.ngAfterViewInit();
  }
  loadPartiesTypes() {
    this.masterService.getPartyTypes().subscribe(
      (res) => {
        var dt = res;
        this.partiesTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].partyId,
            type: dt[a].name,
          };
          this.partiesTypes.push(_data);
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
