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
import { DialogModule } from 'primeng/dialog';
import { Router, RouterLink } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { catchError, map, merge, startWith, switchMap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { SelectModule } from 'primeng/select';
import { DataNotFoundComponent } from '../../data-not-found/data-not-found.component';
import { LoadingComponent } from '../../loading/loading.component';
import { SuperAdminService } from '../../../services/super-admin-service/super-admin.service';
import { AccountService } from '../../../services/account-service/account.service';
import { bankLedgerModel, expenseModel } from '../../../models/super-admin/super-admin-model';
import { masterModal } from '../../../models/master-model/master-model';
import { MasterService } from '../../../services/master-service/master.service';

@Component({
  selector: 'app-expanses',
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    CommonModule,
    DataNotFoundComponent,
    LoadingComponent,
    ToastModule,
    SelectModule,
  ],
  templateUrl: './expanses.component.html',
  styleUrl: './expanses.component.scss',
  providers: [MessageService],
})
export class ExpansesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchKey: any = null;
  isLoadingResults: boolean = false;
  isRateLimitReached = false;
  visible: boolean = false;
  addLoading: boolean = false;
  resultsLength: any = 0;
  bankTypes:any[]=[];
  partiesTypes: masterModal[] = [];
  expenseStatus: masterModal[] = [];
  expenseList: expenseModel[] = [];
  dataSource!: MatTableDataSource<expenseModel>;
  attachment:any=null;
  addExpanseModel!: FormGroup;
  addExpanseFromData: FormData = new FormData();
  //for file
  fileFromData: FormData = new FormData();
  fileName:any=null;
  fileToAppend:any=null;
  fileURL:any=null;

  displayedColumns: string[] = [
    'name',
    'date',
    'amount',
    'payMethod',
    'desc',
    'party',
    'status'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private superAdminService: SuperAdminService,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router,
    private masterService: MasterService
    
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadPartiesTypes();
  }
  initForm() {
    this.addExpanseModel = this.formBuilder.group({
      date: [null, [Validators.required]],
      name: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(1)]],
      paymentMethod: [null, [Validators.required]],
      description: [null,[Validators.required]],
      partyId: [null,[Validators.required]],
      expenseStatusId: [null, [Validators.required]],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // this.getExpansesList();
    }, 0);
  }
  getExpansesList(){};
  // getExpansesList() {
  //   this.paginator.pageIndex = 0;
  //   this.paginator.page.observers = [];
  //   this.expenseList = [];
  //   this.dataSource = new MatTableDataSource(this.expenseList);
  //   this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  //   merge(this.paginator.page)
  //     .pipe(
  //       startWith({}),
  //       switchMap(() => {
  //         this.isLoadingResults = true;
  //         this.expenseList = [];
  //         this.dataSource = new MatTableDataSource(this.expenseList);

  //         if (this.searchKey == null || this.searchKey == '') {
  //           this.searchKey = null;
  //         }

  //         let data = {
  //           searchKey: this.searchKey,
  //           pageNumber: this.paginator.pageIndex + 1,
  //           pageSize: 10,
  //         };

  //         return this.superAdminService.getExpenseBySearchFilter(data).pipe(
  //           catchError((resp: any) => {
  //             if (resp.status == 401) {
  //               this.accountService.doLogout();
  //               this.router.navigateByUrl('/');
  //             }
  //             return resp;
  //           })
  //         );
  //       }),
  //       map((data) => {
  //         this.isRateLimitReached = data === null;
  //         if (data === null) {
  //           return [];
  //         }
  //         this.resultsLength = data.data.totalCount;
  //         return data.data;
  //       })
  //     )
  //     .subscribe(
  //       (data) => {
  //         let dt = data.list;
  //         for (let a = 0; a < dt.length; a++) {
  //           let expense: expenseModel = {
  //           updatedBy: dt[a].updatedBy,
  //           updatedAt: dt[a].updatedAt,
  //           expenseId: dt[a].expenseId,
  //           party: dt[a].party,
  //           expenseStatus: dt[a].expenseStatus,
  //           createdBy: dt[a].createdBy,
  //           createdAt: dt[a].createdAt,
  //           date: dt[a].date,
  //           name: dt[a].name,
  //           amount: dt[a].amount,
  //           paymentMethod: dt[a].paymentMethod,
  //           description: dt[a].description,
  //           partyId: dt[a].partyId,
  //           attachment: dt[a].attachment,
  //           expenseStatusId: dt[a].expenseStatusId
  //           };
           
  //           this.expenseList.push(expense);
  //         }
  //         this.dataSource = new MatTableDataSource(this.expenseList);
  //         this.isLoadingResults = false;
  //       },
  //       (error) => {
  //         this.isLoadingResults = false;
  //         if (error.status == 401) {
  //           this.accountService.doLogout();
  //           this.router.navigateByUrl('/');
  //         }
  //       }
  //     );
  // }
    loadPartiesTypes() {
    this.masterService.getPartyTypes().subscribe(
      (res) => {
        var dt = res;
        this.partiesTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].partyId,
            type: dt[a].name
          };
          this.partiesTypes.push(_data);
        }
        // this.loadExpenseStatus();
      },

      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  // loadExpenseStatus() {
  //   this.masterService.getExpenseStatus().subscribe(
  //     (res) => {
  //       var dt = res;
  //       this.expenseStatus = [];
  //       for (let a = 0; a < dt.length; a++) {
  //         let _data: masterModal = {
  //           id: dt[a].key,
  //           type: dt[a].value
  //         };
  //         this.expenseStatus.push(_data);
  //       }
  //     },

  //     (error) => {
  //       if (error.status == 401) {
  //         this.accountService.doLogout();
  //       }
  //     }
  //   );
  // }
  
    onUploadFile(event: any) {
    this.fileFromData = new FormData();
    const file = event.target.files[0]; // only first file

  if (file) {
    this.fileName = file.name; // reset and store only one filename
    this.attachment=file.name;
    this.fileToAppend = file;   // reset and store only one file
    console.log("File name:", this.fileName);
    console.log("File:", this.fileToAppend);


    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.fileURL = [reader.result as string]; // reset and store only one preview
    };
  }
}

  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
        // this.getExpansesList();
      }
    }
  }

  addExpense() {
    this.addLoading = true;
    this.addExpanseFromData = new FormData();
      this.addExpanseFromData.append('Date', this.addExpanseModel.value.date);
      this.addExpanseFromData.append('Name', this.addExpanseModel.value.name);
      this.addExpanseFromData.append('Amount', this.addExpanseModel.value.amount);
      this.addExpanseFromData.append('PaymentMethod', this.addExpanseModel.value.paymentMethod);
      this.addExpanseFromData.append('Description', this.addExpanseModel.value.description);
      this.addExpanseFromData.append('PartyId', this.addExpanseModel.value.partyId);
      this.addExpanseFromData.append('Attachment', this.fileToAppend);
      this.addExpanseFromData.append('ExpenseStatusId', this.addExpanseModel.value.expenseStatusId);
  
    // this.superAdminService.addExpense(this.addExpanseFromData).subscribe(
    //   (dt) => {
    //     this.addLoading = false;
    //     this.visible = false;
    //     this.getExpansesList();
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Added',
    //       detail: 'Expense added successfully',
    //       life: 3000,
    //     });
    //   },
    //   (error) => {
    //     this.addLoading = false;
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: error.error.message,
    //       life: 3000,
    //     });
    //     if (error.status == 401) {
    //       this.accountService.doLogout();
    //       this.router.navigateByUrl('/');
    //     }
    //   }
    // );
  }
  ResetFilter() {
    this.searchKey = null;
    this.ngAfterViewInit();
  }
}
