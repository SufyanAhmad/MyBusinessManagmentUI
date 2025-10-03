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
  isFemale: boolean = true;
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
        isFemale: [true],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
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
