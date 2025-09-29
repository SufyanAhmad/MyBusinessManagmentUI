import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SuperAdminService } from '../../../../services/super-admin-service/super-admin.service';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../../../services/account-service/account.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  CustomerModel,
  EmployeeModel,
} from '../../../../models/super-admin/super-admin-model';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { masterModal } from '../../../../models/master-model/master-model';
import { MasterService } from '../../../../services/master-service/master.service';

@Component({
  selector: 'app-edit-employees',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    FormsModule,
    RouterModule,
    SelectModule,
  ],
  templateUrl: './edit-employees.component.html',
  styleUrl: './edit-employees.component.scss',
  providers: [MessageService],
})
export class EditEmployeesComponent {
  isReadOnly: boolean = true;
  isActive: boolean = false;
  loading: boolean = false;
  addLoading: boolean = false;
  editLoading: boolean = false;
  employeeId: any = null;
  busUnitId: any = null;
  BusinessUnits: masterModal[] = [];
  EmployeeTypes: masterModal[] = [];
  editEmployeeModel!: FormGroup;

  EmployeeDetail: EmployeeModel = {
    employeeId: '',
    employeeType: '',
    businessUnit: '',
    name: '',
    employeeTypeId: 0,
    joiningDate: '',
    salary: 0,
    endDate: '',
    businessUnitId: '',
  };
  constEmployeeDetail: EmployeeModel = {
    employeeId: '',
    employeeType: '',
    businessUnit: '',
    name: '',
    employeeTypeId: 0,
    joiningDate: '',
    salary: 0,
    endDate: '',
    businessUnitId: '',
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private superAdminService: SuperAdminService,
    private messageService: MessageService,
    private accountService: AccountService,
    private masterService: MasterService
  ) {}
  ngOnInit() {
    this.employeeId = this.route.snapshot.params['id'];
    this.initForm();
    this.getEmployeeDetails();
    this.loadBusinessUnits();
    this.loadEmployeeTypes();
  }

  getEmployeeDetails() {
    this.loading = true;
    this.superAdminService.getEmployeeDetail(this.employeeId).subscribe(
      (dt) => {
        let data = dt;
        this.EmployeeDetail = {
          employeeId: data.employeeId,
          employeeType: data.employeeType,
          businessUnit: data.businessUnit,
          name: data.name,
          employeeTypeId: data.employeeTypeId,
          joiningDate: data.joiningDate,
          salary: data.salary,
          endDate: data.endDate,
          businessUnitId: data.businessUnitId,
        };
        this.constEmployeeDetail = {
          employeeId: data.employeeId,
          employeeType: data.employeeType,
          businessUnit: data.businessUnit,
          name: data.name,
          employeeTypeId: data.employeeTypeId,
          joiningDate: data.joiningDate,
          salary: data.salary,
          endDate: data.endDate,
          businessUnitId: data.businessUnitId,
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
  editEmployeeDetail() {
    this.editLoading = true;
    let endDate=this.editEmployeeModel.value.endDate;
    if(endDate==''){
      this.editEmployeeModel.value.endDate=null;
    }
    this.superAdminService
      .updateEmployee(this.employeeId, this.editEmployeeModel.value)
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Employee updated successfully',
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

  discardChanges() {
    this.EmployeeDetail = {
      employeeId: this.constEmployeeDetail.employeeId,
      employeeType: this.constEmployeeDetail.employeeType,
      businessUnit: this.constEmployeeDetail.businessUnit,
      name: this.constEmployeeDetail.name,
      employeeTypeId: this.constEmployeeDetail.employeeTypeId,
      joiningDate: this.constEmployeeDetail.joiningDate,
      salary: this.constEmployeeDetail.salary,
      endDate: this.constEmployeeDetail.endDate,
      businessUnitId: this.constEmployeeDetail.businessUnitId,
    };
    this.isReadOnly = true;
    this.initForm();
  }
  initForm() {
    this.EmployeeDetail.joiningDate =
      this.EmployeeDetail.joiningDate?.split('T')[0] || '';
    this.EmployeeDetail.endDate =
      this.EmployeeDetail.endDate?.split('T')[0] || '';
    this.editEmployeeModel = this.formBuilder.group({
      name: [this.EmployeeDetail.name, [Validators.required]],
      employeeTypeId: [this.EmployeeDetail.employeeTypeId, Validators.required],
      businessUnitId: [
        this.EmployeeDetail.businessUnitId,
        [Validators.required],
      ],
      joiningDate: [this.EmployeeDetail.joiningDate, [Validators.required]],
      endDate: [this.EmployeeDetail.endDate],
      salary: [this.EmployeeDetail.salary],
    });
  }
  goBack() {
    this.location.back();
  }
  loadBusinessUnits() {
    this.masterService.getBusinessUnitsById(this.busUnitId).subscribe(
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
  editEmployeeStatus(employeeId: any, status: any) {
    this.superAdminService.updateEmployeeStatus(employeeId, status).subscribe(
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
}
