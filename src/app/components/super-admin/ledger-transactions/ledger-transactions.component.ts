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
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
 interface partyType {
  id: any;
  type: string;
  partyTypeId:number
}
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
  partiesTypes: partyType[] = [];
  employeeList: masterModal[] = [];
  bankLedgerList: masterModal[] = [];
  accountTypes: masterModal[] = [];
  expenseTypes: masterModal[] = [];
  businessUnits: masterModal[] = [];
  partyId: any = null;
  totalCredit: number = 0;
  totalDebit: number = 0;
  visible: boolean = false;
  addLoading: boolean = false;
  isShowLabel:boolean=false;
  isBusinessUnitShow:boolean=true;
  resetUerId: any = null;
  addCustomerModel!: FormGroup;
  ingredient: any = null;
  busUnitId: any = null;
  bankId: any = null;
  accountTypeId: any = null
  employeeId: any = null;
  expenseId: any = null;
  openingBalance: any = 0;
  to: any = null;
  from: any = null;
  _businessUnitId: any = null;
  businessUnitName: any = '';
  checkRouteUrl: string = '';
  accountTypeIdFroDebit:any=1;
  selectedItemId:any=0;
  displayedColumns: string[] = [
    'reference',
    'name',
    'busName',
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
    private router: Router,
    private http: HttpClient

  ) {}

  ngOnInit() {
    this.checkRouteUrl = this.router.url;
    this._businessUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    if (this.checkRouteUrl != '/superAdmin/ledger-transactions') {
            this.isShowLabel = true;
            this.isBusinessUnitShow=false;
          }

    this.initForm();
    this.loadPartiesTypes();
    this.loadBusinessUnits();
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
          this.totalCredit=0;
          this.totalDebit=0;
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
          if (this.checkRouteUrl != '/superAdmin/ledger-transactions') {
            busUnitId = this._businessUnitId;
          }
          if(this.accountTypeId==1){
            this.bankId=null;
            this.employeeId=null;
            this.expenseId=null;
          }
          else if(this.accountTypeId==2){
            this.bankId=null;
            this.expenseId=null;
            this.partyId=null;
          }
          else if(this.accountTypeId==3){
            this.employeeId=null;
            this.expenseId=null;
            this.partyId=null;
          }else{
            this.employeeId=null;
            this.bankId=null;
            this.partyId=null;
          }

          let data = {
            searchKey: this.searchKey,
            clientId: this.partyId,
            businessUnitId: busUnitId,
            bankId:this.bankId,
            accountTypeId:this.accountTypeId,
            employeeId:this.employeeId,
            expenseId: this.expenseId,
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
              account:data.list[a].account,
              productTypeId: data.list[a].productTypeId,
              productType: data.list[a].productType,
              businessUnitId: data.list[a].businessUnitId,
              businessUnit: data.list[a].businessUnit,
              date: data.list[a].date,
              isCredit: data.list[a].isCredit,
              isReturned:data.list[a].isReturned?data.list[a].isReturned:false,
              totalPayment: data.list[a].totalPayment? data.list[a].totalPayment: 0,
              paidAmount: data.list[a].paidAmount,
              remainingBalance: data.list[a].isCredit? balance + data.list[a].totalPayment
                : balance - data.list[a].totalPayment,
            };
            if(a==0){
              transaction.remainingBalance= this.openingBalance + transaction.remainingBalance;
            }
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
generateReport(){
  let busUnitId = null;
          if (this.checkRouteUrl != '/superAdmin/ledger-transactions') {
            busUnitId = this._businessUnitId;
          }
          let data = {
            searchKey: this.searchKey,
            clientId: this.partyId,
            businessUnitId: this.busUnitId,
            bankId:this.bankId,
            accountTypeId:this.accountTypeId,
            employeeId:this.employeeId,
            expenseId: this.expenseId,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
            from: this.from,
            to: this.to,
          };
           

          // generate purchase report
          const baseUrl = environment.apiUrl;
          let route = '/Report/generate-ledger-report';
          const token = this.accountService.getToken();
          // this.loadReport = true;
          const headers = new HttpHeaders().set('authorization', 'Bearer ' + token);
         this.http
              .post(baseUrl + route, data, {
                headers,
                responseType: 'blob',
                observe: 'response', // 👈 get full response (including headers)
              })
              .subscribe((res: HttpResponse<Blob>) => {
                // ✅ Extract filename from content-disposition content-disposition
                const contentDisposition = res.headers.get('content-disposition');
                let filename = 'Report.pdf';
                if (contentDisposition) {
                  const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
                    contentDisposition
                  );
                  if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                  }
                }
        
                // ✅ Download file
                const blob = new Blob([res.body!], { type: res.body!.type });
                const downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(blob);
                downloadLink.setAttribute('download', filename);
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
              });

       
  }
 
  loadPartiesTypes() {
    this.masterService.getPartyTypes().subscribe(
      (res) => {
        var dt = res;
        this.partiesTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: partyType = {
            id: dt[a].partyId,
            type: dt[a].name,
            partyTypeId:dt[a].partyTypeId
          };
          this.partiesTypes.push(_data);
        }
        this.loadEmployeeList();
      },

      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
   loadEmployeeList() {
     let busUnitId = null;
          if (this.checkRouteUrl != '/superAdmin/ledger-transactions') {
            busUnitId = this._businessUnitId;
          }
    // this.masterService.getEmployeesById(busUnitId).subscribe(
    //   (res) => {
    //     var dt = res.data;
    //     this.employeeList = [];
    //     for (let a = 0; a < dt.length; a++) {
    //       let _data: masterModal = {
    //         id: dt[a].employeeId,
    //         type: dt[a].employee,
    //       };
    //       this.employeeList.push(_data);
    //     }
    //     this.loadBankLedgerList();
    //   },

    //   (error) => {
    //     if (error.status == 401) {
    //       this.accountService.doLogout();
    //     }
    //   }
    // );
  }
  loadBankLedgerList() {
    // this.masterService.getBankLedger().subscribe(
    //   (res) => {
    //     var dt = res.data;
    //     this.bankLedgerList = [];
    //     for (let a = 0; a < dt.length; a++) {
    //       let _data: masterModal = {
    //         id: dt[a].bankId,
    //         type: dt[a].bank,
    //       };
    //       this.bankLedgerList.push(_data);
    //     }
    //     this.loadAccountList();
    //   },

    //   (error) => {
    //     if (error.status == 401) {
    //       this.accountService.doLogout();
    //     }
    //   }
    // );
  }
  loadAccountList() {
    // this.masterService.getAccountTypes().subscribe(
    //   (res) => {
    //     var dt = res.data;
    //     this.accountTypes = [];
    //     for (let a = 0; a < dt.length; a++) {
    //       let _data: masterModal = {
    //         id: dt[a].accountTypeId,
    //         type: dt[a].name,
    //       };
    //       this.accountTypes.push(_data);
    //     }
    //     this.loadExpenseList();
    //   },

    //   (error) => {
    //     if (error.status == 401) {
    //       this.accountService.doLogout();
    //     }
    //   }
    // );
  }
  loadExpenseList() {
    // this.masterService.getExpenseTypes().subscribe(
    //   (res) => {
    //     var dt = res.data;
    //     this.expenseTypes = [];
    //     for (let a = 0; a < dt.length; a++) {
    //       let _data: masterModal = {
    //         id: dt[a].expenseId,
    //         type: dt[a].name,
    //       };
    //       this.expenseTypes.push(_data);
    //     }
    //   },

    //   (error) => {
    //     if (error.status == 401) {
    //       this.accountService.doLogout();
    //     }
    //   }
    // );
  }
    loadBusinessUnits() {
    this.masterService.getBusinessUnitTypes().subscribe(
      (res) => {
        var dt = res;
        this.businessUnits = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].businessUnitId,
            type: dt[a].name,
          };
          this.businessUnits.push(_data);
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
          //  this.addCustomerModel.value.businessUnitId = null;
          }
          let paymentTypeId=this.addCustomerModel.value.paymentTypeId;
          if(paymentTypeId==1){
            this.addCustomerModel.value.debitAmount=null;
            this.addCustomerModel.value.debitAccountTypeId=null;
          }else if(paymentTypeId==2){
            this.addCustomerModel.value.creditAccountTypeId=null;
          }
        // console.log(this.addCustomerModel.value);
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
            detail: 'Payment added successfully',
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
      creditAccountTypeId: [1, [Validators.required]],
      debitAccountTypeId: [1],
      isClient: [true],
      creditClientId: [null],
      debitClientId: [null],
      creditEmployeeId: [null],
      debitEmployeeId: [null],
      creditBankId: [null],
      debitBankId: [null],
      creditExpenseId: [null],
      debitExpenseId: [null],
      paymentDate: [
        new Date().toISOString().substring(0, 10),
        [Validators.required],
      ],
      creditAmount: [null],
      debitAmount: [null],
      note: [''],
      paymentTypeId: [1, [Validators.required]],
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
 setSelectedItemValue(event: any) {
  // Find the matching object from partiesTypes 
  const selected = this.partiesTypes.find((item: any) => item.id === event.value);

  // Store the full object in selectedItem
  if (selected) {
    this.selectedItemId = selected.partyTypeId;
  } 
  this.ngAfterViewInit();
}
// reset Form when change payment Method
resetFormValue(){
  let paymentId=this.addCustomerModel.value.paymentTypeId;
  let crAccountTypeId=this.addCustomerModel.value.creditAccountTypeId;
  let drAccountTypeId=this.addCustomerModel.value.debitAccountTypeId;
  this.initForm();
  this.addCustomerModel.patchValue({ paymentTypeId: paymentId, creditAccountTypeId: crAccountTypeId,debitAccountTypeId:drAccountTypeId });
}
  ResetFilter() {
    this.searchKey = null;
    this.partyId = null;
    this.bankId = null;
    this.employeeId = null;
    this.accountTypeId = null;
    this.expenseId = null;
    this.from = null;
    this.to = null;
    this.ngAfterViewInit();
  }
}
