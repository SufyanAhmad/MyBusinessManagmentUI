import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import {
  BusinessCountModel,
  UserModel,
} from '../../../../models/super-admin/super-admin-model';
import { SuperAdminService } from '../../../../services/super-admin-service/super-admin.service';
import { AccountService } from '../../../../services/account-service/account.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { masterModal } from '../../../../models/master-model/master-model';
import { MasterService } from '../../../../services/master-service/master.service';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-edit-users',
  imports: [
    FormsModule,
    CommonModule,
    CheckboxModule,
    ReactiveFormsModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: './edit-users.component.html',
  styleUrl: './edit-users.component.scss',
  providers: [MessageService],
})
export class EditUsersComponent {
  isReadOnly: boolean = true;
  loading: boolean = false;
  editLoading: boolean = false;
  isActive: boolean = false;
  isConfirmationVisible = false;
  userId: any = null;
  UserRoles: masterModal[] = [];

  editUserModel!: FormGroup;
  userDetail: UserModel = {
    userId: '',
    userNo: '',
    fullName: '',
    email: '',
    imageLink: '',
    userRoleId: '',
  };
  constUserDetail: UserModel = {
    userId: '',
    userNo: '',
    fullName: '',
    email: '',
    imageLink: '',
    userRoleId: '',
  };
  businessCountsDetail: BusinessCountModel = {
    coldStoreCoun: 0,
    poultryFarmCoun: 0,
    storageUnitCoun: 0,
  };
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private superAdminService: SuperAdminService,
    private messageService: MessageService,
    private masterService: MasterService,
    private accountService: AccountService
  ) {}
  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
    this.initForm();
    this.getBusinessCountsDetail();
    this.getUserDetails();
  }
  initForm() {
    this.editUserModel = this.formBuilder.group({
      userId: [this.userDetail.userId, [Validators.required]],
      userNo: [this.userDetail.userNo],
      fullName: [this.userDetail.fullName, [Validators.required]],
      email: [this.userDetail.email, [Validators.required]],
      imageLink: [this.userDetail.imageLink],
      userRoleId: [this.userDetail.userRoleId, [Validators.required]],
    });
  }
  getUserDetails() {
    this.loading = true;
    this.superAdminService.getUserDetail(this.userId).subscribe(
      (dt) => {
        let data = dt;
        this.userDetail = {
          userId: data.userId,
          userNo: data.userNo,
          fullName: data.fullName,
          email: data.email,
          imageLink: data.imageLink ? data.imageLink : 'assets/images/user.png',
          isActive: data.isActive,
          userRoleId: data.userRoleId,
        };
        this.constUserDetail = {
          userId: data.userId,
          userNo: data.userNo,
          fullName: data.fullName,
          email: data.email,
          imageLink: data.imageLink ? data.imageLink : 'assets/images/user.png',
          isActive: data.isActive,
          userRoleId: data.userRoleId,
        };
        this.initForm();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
          life: 4000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  getBusinessCountsDetail() {
    this.superAdminService.getBusinessCounts(this.userId).subscribe(
      (dt) => {
        this.businessCountsDetail = {
          coldStoreCoun: dt.coldStoreCount,
          poultryFarmCoun: dt.poultryFarmCount,
          storageUnitCoun: dt.storageUnitCount,
        };
        this.getDairyUserRoles();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
          life: 4000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  editUserDetail() {
    this.editLoading = true;
    this.superAdminService
      .updateUserDetail(this.userId, this.editUserModel.value)
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'User updated successfully',
            life: 3000,
          });
          this.goBack();
          this.editLoading = false;
        },
        (error) => {
          this.editLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 3000,
          });
          if (error.status == 401) {
            this.accountService.doLogout();
          }
        }
      );
  }
  deleteUser() {
    this.superAdminService.deleteUser(this.userId).subscribe(
      (dt) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'User deleted successfully',
          life: 3000,
        });
        this.goBack();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  discardChanges() {
    this.userDetail = {
      userId: this.constUserDetail.userId,
      userNo: this.constUserDetail.userNo,
      fullName: this.constUserDetail.fullName,
      email: this.constUserDetail.email,
      imageLink: this.constUserDetail.imageLink,
      isActive: this.constUserDetail.isActive,
      userRoleId: this.constUserDetail.userRoleId,
    };
    this.isReadOnly = true;
    this.initForm();
  }
  goBack() {
    this.location.back();
  }
  getDairyUserRoles() {
    this.masterService.getUserRoles().subscribe(
      (res: any) => {
        let dt = res; // response is directly an array
        this.UserRoles = [];

        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.UserRoles.push(_data);
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
