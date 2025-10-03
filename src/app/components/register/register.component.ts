import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account-service/account.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ToastModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [MessageService],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  loginLoading: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private messageService: MessageService
  ) {
    // this.gotoDashboard();
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required]],
        password: [
          '',
          Validators.compose([Validators.required, Validators.minLength(8)]),
        ],
        confirmPassword: ['', Validators.required],
        rememberMe: [true],
        phone: [''],
        province: [''],
        district: [''],
        city: [''],
        postal: [''],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
  }
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  onSubmitLogin() {
    this.loginLoading = true;
    if (this.registerForm.valid) {
      this.accountService.login(this.registerForm.value).subscribe(
        (dt) => {
          // this.router.navigateByUrl('/dairyFarm/animal');
          this.router.navigateByUrl('/superAdmin');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User login successfully',
            life: 3000,
          });
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
      this.router.navigateByUrl('/superAdmin');
    }
  }
}
