import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account-service/account.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MasterService } from '../../services/master-service/master.service';
import { masterModal } from '../../models/master-model/master-model';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    RouterModule,
    SelectModule,
    ToastModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [MessageService],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  loginLoading: boolean = false;
  userRoleId: any = null;
  UserType: masterModal[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private messageService: MessageService,
    private masterService: MasterService
  ) {
    // this.gotoDashboard();
  }
  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        fullName: ['', Validators.required],
        contactNumber: [null],
        email: ['', [Validators.required]],
        userRoleId: ['', [Validators.required]],
        address: [null],
        password: [
          '',
          Validators.compose([Validators.required, Validators.minLength(8)]),
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
    this.loadUserType();
  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({
        ...(form.get('confirmPassword')?.errors || {}),
        mismatch: true,
      });
    } else {
      const errors = form.get('confirmPassword')?.errors;
      if (errors) {
        delete errors['mismatch'];
        if (Object.keys(errors).length === 0) {
          form.get('confirmPassword')?.setErrors(null);
        } else {
          form.get('confirmPassword')?.setErrors(errors);
        }
      }
    }
    return null;
  }
  onSubmitRegister() {
    this.loginLoading = true;
    if (this.registerForm.valid) {
      this.accountService.Register(this.registerForm.value).subscribe(
        (dt) => {
          // this.router.navigateByUrl('/dairyFarm/animal');
          this.router.navigateByUrl('/login');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Your account has been created successfully',
            life: 3000,
          });
          console.log('✅ Toast triggered');
          this.loginLoading = false;
        },
        (error) => {
          this.loginLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message,
            life: 4000,
          });
        }
      );
    }
  }
  showHidePassword() {
    this.showPassword = !this.showPassword;
  }
  gotoDashboard() {
    if (this.accountService.isLoggedIn) {
      this.router.navigateByUrl('/login');
    }
  }
  loadUserType() {
    this.masterService.getUserRoles().subscribe(
      (res) => {
        const dt = res;
        this.UserType = [];
        for (let a = 0; a < dt.length; a++) {
          const _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.UserType.push(_data);
        }
      },
      (error) => {
        if (error.status === 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
}
