
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
import { bankLedgerModel } from '../../../models/super-admin/super-admin-model';

@Component({
  selector: 'app-bank-ledger',
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
  templateUrl: './bank-ledger.component.html',
  styleUrl: './bank-ledger.component.scss',
  providers: [MessageService],
})
export class BankLedgerComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchKey: any = null;
  isLoadingResults: boolean = false;
  isRateLimitReached = false;
  visible: boolean = false;
  addLoading: boolean = false;
  resultsLength: any = 0;
  bankTypes:any[]=[];
  bankLedgerList: bankLedgerModel[] = [];
  dataSource!: MatTableDataSource<bankLedgerModel>;
  addBankLedgerModel!: FormGroup;
  displayedColumns: string[] = [
    'account',
    'accountNo',
    'bankName',
    'code',
    'city'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private superAdminService: SuperAdminService,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.addBankLedgerModel = this.formBuilder.group({
      accountTitle: [null, [Validators.required]],
      accountNumber: [
        null,
        [
          Validators.required,
          Validators.pattern('^[1-9][0-9]*$'),
        ],
      ],
      bankName: [null, [Validators.required]],
      branchCode: [null, [Validators.required]],
      city: [null, [Validators.required]],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getBankLedgerList();
    }, 0);
  }
  getBankLedgerList() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.bankLedgerList = [];
    this.dataSource = new MatTableDataSource(this.bankLedgerList);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.bankLedgerList = [];
          this.dataSource = new MatTableDataSource(this.bankLedgerList);

          if (this.searchKey == null || this.searchKey == '') {
            this.searchKey = null;
          }

          let data = {
            searchKey: this.searchKey,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.superAdminService.getBankLedgerBySearchFilter(data).pipe(
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
          this.resultsLength = data.data.totalCount;
          return data.data;
        })
      )
      .subscribe(
        (data) => {
          let dt = data.list;
          for (let a = 0; a < dt.length; a++) {
            let bankLedger: bankLedgerModel = {
               bankLedgerId: dt[a].bankLedgerId,
              createdBy: dt[a].createdBy,
              createdAt: dt[a].createdAt,
              accountTitle: dt[a].accountTitle,
              accountNumber: dt[a].accountNumber,
              bankName: dt[a].bankName,
              branchCode: dt[a].branchCode,
              city: dt[a].city
            };
            this.bankLedgerList.push(bankLedger);
          }
          this.dataSource = new MatTableDataSource(this.bankLedgerList);
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
  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
        this.getBankLedgerList();
      }
    }
  }

  addBankLedger() {
    this.addLoading = true;
    this.superAdminService.addBankLedger(this.addBankLedgerModel.value).subscribe(
      (dt) => {
        this.addLoading = false;
        this.visible = false;
        this.getBankLedgerList();
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Bank ledger added successfully',
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
  preventDecimal(event: KeyboardEvent) {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
    }
  }
  ResetFilter() {
    this.searchKey = null;
    this.ngAfterViewInit();
  }
  // loadPartiesTypes() {
  //   this.masterService.getPartyTypesByPartyId(1).subscribe(
  //     (res) => {
  //       var dt = res;
  //       this.partiesTypes = [];
  //       for (let a = 0; a < dt.length; a++) {
  //         let _data: masterModal = {
  //           id: dt[a].partyId,
  //           type: dt[a].name,
  //         };
  //         this.partiesTypes.push(_data);
  //       }
  //     },
  //     (error) => {
  //       if (error.status == 401) {
  //         this.accountService.doLogout();
  //       }
  //     }
  //   );
  // }
}
