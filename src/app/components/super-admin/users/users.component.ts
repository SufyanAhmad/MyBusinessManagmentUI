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
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { Router, RouterLink } from '@angular/router';
import {
  AddedBusinessUnitModel,
  BusinessUnitModel,
  UserModel,
} from '../../../models/super-admin/super-admin-model';
import { catchError, map, merge, startWith, switchMap, tap } from 'rxjs';
import { SuperAdminService } from '../../../services/super-admin-service/super-admin.service';
import { AccountService } from '../../../services/account-service/account.service';
import { MasterService } from '../../../services/master-service/master.service';
import { masterModal } from '../../../models/master-model/master-model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoadingComponent } from '../../loading/loading.component';
import { DataNotFoundComponent } from '../../data-not-found/data-not-found.component';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { ConfirmationPopupComponent } from '../../confirmation-popup/confirmation-popup.component';
@Component({
  selector: 'app-users',
  imports: [
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    CommonModule,
    CheckboxModule,
    SelectModule,
    SkeletonModule,
    ToastModule,
    LoadingComponent,
    DataNotFoundComponent,
    ConfirmationPopupComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [MessageService],
})
export class UsersComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  usersList: UserModel[] = [];
  dataSource!: MatTableDataSource<UserModel>;
  isRateLimitReached = false;
  isLoadingResults: any = false;
  assignLoading: boolean = false;
  editLoading: boolean = false;

  loading: boolean = false;
  resultsLength: any = 0;
  type: string = '';
  searchKey: any = null;
  businessTypes: masterModal[] = [];
  businessUnitTypes: masterModal[] = [];
  userRoles: masterModal[] = [];
  dairyFarmUnitList: BusinessUnitModel[] = [];
  addedDairyFarmUnitList: AddedBusinessUnitModel[] = [];
  userBusinessUnitAndRoleDtosCount: number = 0;
  userEditBusinessUnitAndRoleDtosCount: number = 0;
  businessTypeId: any = 3;
  businessUnitId: any = null;
  isActive: any = null;
  userId: any = null;
  applicationUserId: any = null;
  visible: boolean = false;
  resetPopupVisible: boolean = false;
  isAssignPopup: boolean = false;
  isViewPopup: boolean = false;
  isAssignUser: boolean = false;
  isUpdatePopup: boolean = false;
  addLoading: boolean = false;
  showNewPassword: boolean = false;
  showResetPassword: boolean = false;
  showConfirmDialog: boolean = false;
  addUserModel!: FormGroup;
  RestUserPasswordForm!: FormGroup;
  displayedColumns: string[] = ['img', 'name', 'email', 'actions', 'forget'];
  constructor(
    private formBuilder: FormBuilder,
    private superAdminService: SuperAdminService,
    private masterService: MasterService,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router
  ) {}
  ngOnInit() {
    this.RestUserPasswordForm = this.formBuilder.group({
      userId: [null],
      conformPassword: [null, [Validators.required]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@!%*?&#])[A-Za-z\\d$@!%*?&#]{8,}$'
          )
        ],
      ],
    });
    this.initForm();
    // this.loadBusinessTypes();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadBusinessUnitTypes();
      this.getUsers();
    }, 0);
  }
  getUsers() {
    this.paginator.pageIndex = 0;
    this.paginator.page.observers = [];
    this.usersList = [];
    this.dataSource = new MatTableDataSource(this.usersList);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.usersList = [];
          this.dataSource = new MatTableDataSource(this.usersList);

          if (this.searchKey == null) {
            this.searchKey = null;
          }
          let data = {
            searchKey: this.searchKey,
            businessTypeId: null,
            businessUnitId: this.businessUnitId,
            isActive: this.isActive,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: 10,
          };

          return this.superAdminService.getUserBySearchFilter(data).pipe(
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
          this.usersList = [];
          for (let a = 0; a < data.list.length; a++) {
            let user: UserModel = {
              userId: data.list[a].userId,
              userNo: data.list[a].userNo,
              fullName: data.list[a].fullName,
              email: data.list[a].email,
              imageLink: data.list[a].imageLink,
              isActive: data.list[a].isActive,
            };
            this.usersList.push(user);
          }
          this.dataSource = new MatTableDataSource(this.usersList);
          this.isLoadingResults = false;
          this.loadUserRoles();
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
  getAllBusinessUnits(userId: any) {
    this.loading = true;
    this.superAdminService.getAllBusinessUnitByUserId(userId).subscribe(
      (dt) => {
        this.dairyFarmUnitList = [];
        for (let a = 0; a < dt.length; a++) {
          let busUnit: BusinessUnitModel = {
            totalProfit: dt[a].totalProfit,
            totalSale: dt[a].totalSale,
            businessUnitId: dt[a].businessUnitId,
            name: dt[a].name,
            location: dt[a].location,
            businessTypeId: dt[a].businessTypeId,
            businessTypeName: dt[a].businessTypeName,
            isAdded: dt[a].isAdded,
            isChecked: false,
            userRoleId: dt[a].userRoleId,
          };
          if (busUnit.businessTypeId == 3) {
            this.dairyFarmUnitList.push(busUnit);
          }
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  getAllAddedBusinessUnits(userId: any) {
    this.loading = true;
    this.superAdminService.getAllAddedBusinessUnitByUserId(userId).subscribe(
      (dt) => {
        debugger
        this.addedDairyFarmUnitList = [];
        for (let a = 0; a < dt.length; a++) {
          let addedBusUnit: AddedBusinessUnitModel = {
            businessUnitId: dt[a].businessUnitId,
            name: dt[a].name,
            businessTypeId: dt[a].businessTypeId,
            businessType: dt[a].businessTypeName,
            userRoleId: dt[a].userRoleId,
            userRole: dt[a].userRole,
            isChecked: true,
          };
          if (addedBusUnit.businessTypeId ==3) {
            this.addedDairyFarmUnitList.push(addedBusUnit);
          }
        }
        this.checkedEditBusinessUnitCounts('dummy');
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  // loadBusinessTypes() {
  //   this.masterService.getBusinessTypes().subscribe(
  //     (res) => {
  //       debugger
  //       var dt = res;
  //       this.businessTypes = [];
  //       for (let a = 0; a < dt.length; a++) {
  //         let _data: masterModal = {
  //           id: dt[a].key,
  //           type: dt[a].value,
  //         };
  //         this.businessTypes.push(_data);
  //       }
  //     },
  //     (error) => {
  //       if (error.status == 401) {
  //         this.accountService.doLogout();
  //       }
  //     }
  //   );
  // }
  loadBusinessUnitTypes() {
    this.masterService.getBusinessUnitTypesById(3).subscribe(
      (res) => {
        var dt = res;
        this.businessUnitTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].businessUnitId,
            type: dt[a].name,
          };
          this.businessUnitTypes.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadUserRoles() {
    this.masterService.getUserRole().subscribe(
      (res) => {
        var dt = res;
        this.userRoles = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.userRoles.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  initForm() {
    this.addUserModel = this.formBuilder.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@!%*?&#])[A-Za-z\\d$@!%*?&#]{8,}$'
          ),
        ],
      ],
    });
  }
  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
        this.getUsers();
      }
    }
  }
  addUser() {
    this.addLoading = true;
    this.superAdminService.addUser(this.addUserModel.value).subscribe(
      (dt) => {
        this.addLoading = false;
        this.visible = false;
        this.getUsers();
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'User added successfully',
          life: 3000,
        });
      },
      (error) => {
        this.addLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  resetPassword() {
    this.addLoading = true;
    this.RestUserPasswordForm.value.userId = this.applicationUserId;
    this.accountService
      .ResetPassword(this.RestUserPasswordForm.value)
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Reset',
            detail: 'Password reset successfully.',
            life: 3000,
          });
          this.resetPopupVisible = false;
          this.addLoading = false;
        },
        (error) => {
          this.addLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message,
            life: 4000,
          });
          if (error.status == 401) {
            this.accountService.doLogout();
            this.router.navigateByUrl('/');
          }
        }
      );
  }
  showNewHidePassword() {
    this.showNewPassword = !this.showNewPassword;
  }
  showResetHidePassword() {
    this.showResetPassword = !this.showResetPassword;
  }
  ResetFilter() {
    this.businessTypeId = null;
    this.businessUnitId = null;
    this.searchKey = null;
    this.isActive = null;
    this.ngAfterViewInit();
  }

  // get all the selected businessUnitId and userRoleId from all lists
  getSelectedBusinessUnits(): any[] {
    const allUnits = [
      ...this.dairyFarmUnitList,
    ];

    return allUnits
      .filter((item) => item.isChecked)
      .map((item) => ({
        businessUnitId: item.businessUnitId,
        userRoleId: item.userRoleId,
      }));
  }
  checkedBusinessUnitCounts(item: any) {
    if (!item.isChecked) {
      item.userRoleId = null;
    }
    this.userBusinessUnitAndRoleDtosCount = 0;
    this.userBusinessUnitAndRoleDtosCount =
      this.getSelectedBusinessUnits().length;
    this.isValidAssignment();
  }
  submitAssignedUnits() {
    this.assignLoading = true;
    const payload = {
      userBusinessUnitAndRoleDtos: this.getSelectedBusinessUnits(),
    };
    let data = {
      applicationUserId: this.applicationUserId,
      userBusinessUnitAndRoleDtos: payload.userBusinessUnitAndRoleDtos,
    };
    // console.log('Assigning Business Units to User:', data);

    this.superAdminService.assignBusinessUnitToUser(data).subscribe(
      (response) => {
        this.assignLoading = false;
        this.isAssignPopup = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Business units assigned successfully',
          life: 3000,
        });
        // this.getUsers();
      },
      (error) => {
        this.assignLoading = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }

  isValidAssignment(): boolean {
    const allSelectedItems = [
      ...this.dairyFarmUnitList,
    ].filter((item) => item.isChecked); // only checked items
    // Return true only if all selected items have a userRoleId
    const allHaveRoles = allSelectedItems.every(
      (item) => item.userRoleId != null && item.userRoleId !== undefined
    );
    return allHaveRoles;
  }
  //
  checkedEditBusinessUnitCounts(item: any) {
    if (item != 'dummy') {
      if (!item.isChecked) {
        item.userRoleId = null;
      }
    }
    this.userEditBusinessUnitAndRoleDtosCount = 0;
    this.userEditBusinessUnitAndRoleDtosCount =
      this.getEditSelectedBusinessUnits().length;
    this.isEditValidAssignment();
  }
  isEditValidAssignment(): boolean {
    const allSelectedItems = [
      ...this.addedDairyFarmUnitList,
    ].filter((item) => item.isChecked); // only checked items
    // Return true only if all selected items have a userRoleId
    const allHaveRoles = allSelectedItems.every(
      (item) => item.userRoleId != null && item.userRoleId !== undefined
    );
    console.log();

    return allHaveRoles;
  }
  // get all the selected businessUnitId and userRoleId from all lists
  getEditSelectedBusinessUnits(): any[] {
    const allUnits = [
      ...this.addedDairyFarmUnitList,
    ];

    return allUnits.map((item) => ({
      businessUnitId: item.businessUnitId,
      userRoleId: item.userRoleId,
      isChecked: item.isChecked ? true : false,
    }));
  }
  // For edit user unit
  submitAddedAssignedUnits() {
    this.editLoading = true;
    let userBusinessUnitAndRoleDtos = this.getEditSelectedBusinessUnits();
    console.log('Edit Business Units to User:', userBusinessUnitAndRoleDtos);

    this.superAdminService
      .updateBusinessUnitToUser(
        this.applicationUserId,
        userBusinessUnitAndRoleDtos
      )
      .subscribe(
        (response) => {
          this.editLoading = false;
          this.isUpdatePopup = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Business units updated successfully',
            life: 3000,
          });
        },
        (error) => {
          // this.isUpdatePopup = false;
          this.editLoading = false;

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message,
            life: 3000,
          });
          if (error.status == 401) {
            this.accountService.doLogout();
            this.router.navigateByUrl('/');
          }
        }
      );
  }
  confirmClearLog() {
    this.showConfirmDialog = true;
  }
  editUserStatus(userId: any, status: any) {
    let data = {
      userId: userId,
      isActive: status,
    };
    this.superAdminService.changeUserStatus(data).subscribe(
      (dt) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'User status update successfully',
          life: 3000,
        });
        // this.getSuppliers();
      },
      (error) => {
        this.addLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  deleteUser() {
    this.showConfirmDialog = false;
    this.superAdminService.deleteUser(this.userId).subscribe(
      (dt) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'User deleted successfully',
          life: 3000,
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }

  handleCancelled() {
    this.showConfirmDialog = false;
  }
}
