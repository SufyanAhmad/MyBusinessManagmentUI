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
import { Router, RouterModule } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { catchError, map, merge, startWith, switchMap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DataNotFoundComponent } from '../../data-not-found/data-not-found.component';
import { LoadingComponent } from '../../loading/loading.component';
import { SuperAdminService } from '../../../services/super-admin-service/super-admin.service';
import { MasterService } from '../../../services/master-service/master.service';
import { AccountService } from '../../../services/account-service/account.service';
import {
  CustomerModel,
  LedgerTransactionModel,
} from '../../../models/super-admin/super-admin-model';
import { masterModal } from '../../../models/master-model/master-model';
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
  @Input() editRouteBase: string = '/superAdmin/ledger-transactions/edit';

  transactionList: LedgerTransactionModel[] = [];
  dataSource!: MatTableDataSource<LedgerTransactionModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  resultsLength: any = 0;
  searchKey: any = null;
  partiesTypes: masterModal[] = [];
  partyId: any = null;
  totalCredit: number = 0;
  totalDebit: number = 0;
  visible: boolean = false;
  addLoading: boolean = false;
  isShowLabel:boolean=false;
  resetUerId: any = null;
  addCustomerModel!: FormGroup;
  ingredient: any = null;
  busUnitId: any = null;
  openingBalance: any = 0;
  to: any = null;
  from: any = null;
  _businessUnitId: any = null;
  businessUnitName: any = '';
  checkRouteUrl: string = '';
  displayedColumns: string[] = [
    'reference',
    'name',
    'product',
    'date',
    'totPayment',
    'paidAmount',
    'remBalance',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private superAdminService: SuperAdminService,
    private masterService: MasterService,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkRouteUrl = this.router.url;
    this._businessUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    if (this.checkRouteUrl == '/storageUnit/ledger-transactions') {
            this.isShowLabel = true;
          }

    this.initForm();
    this.loadPartiesTypes();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getLedgerTransaction();
    }, 0);
  }
  getLedgerTransaction() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.transactionList = [];
    this.dataSource = new MatTableDataSource(this.transactionList);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.transactionList = [];
          this.dataSource = new MatTableDataSource(this.transactionList);
          if (this.searchKey == null) {
            this.searchKey = null;
          }
          if (this.to == '' || this.from == '') {
            this.to = null;
            this.from = null;
          }
          let busUnitId = null;
          if (this.checkRouteUrl == '/storageUnit/ledger-transactions') {
            busUnitId = this._businessUnitId;
          }

          let data = {
            searchKey: this.searchKey,
            clientId: this.partyId,
            businessUnitId: busUnitId,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
            from: this.from,
            to: this.to,
          };

          return this.superAdminService
            .getLedgerTransactionBySearchFilter(data)
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
          this.transactionList = [];
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
            let transaction: LedgerTransactionModel = {
              paymentId: data.list[a].paymentId,
              reference: data.list[a].reference,
              clientId: data.list[a].clientId,
              client: data.list[a].client,
              productTypeId: data.list[a].productTypeId,
              productType: data.list[a].productType,
              date: data.list[a].date,
              isCredit: data.list[a].isCredit,
              totalPayment: data.list[a].totalPayment
                ? data.list[a].totalPayment
                : 0,
              paidAmount: data.list[a].paidAmount,
              remainingBalance: data.list[a].isCredit
                ? balance + data.list[a].totalPayment
                : balance - data.list[a].totalPayment,
            };
            balance = Number(transaction.remainingBalance);
            this.transactionList.push(transaction);
          }
          this.totalCredit = totalCredit;
          this.totalDebit = totalDebit;
          this.dataSource = new MatTableDataSource(this.transactionList);
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
  AddCustomerPayment() {
    this.addLoading = true;
     if (this.checkRouteUrl == '/superAdmin/ledger-transactions') {
           this.addCustomerModel.value.businessUnitId = null;
          }
    this.superAdminService
      .addCustomerPayment(this.addCustomerModel.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          this.getLedgerTransaction();
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
  onEditLegerTransactions(partyId: any) {
    this.router.navigate([this.editRouteBase, partyId]);
  }
  initForm() {
    this.addCustomerModel = this.formBuilder.group({
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

    this.addCustomerModel
      .get('creditAmount')
      ?.valueChanges.subscribe((value) => {
        this.addCustomerModel
          .get('debitAmount')
          ?.setValue(value, { emitEvent: false });
      });
  }
  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
        this.getLedgerTransaction();
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
}
