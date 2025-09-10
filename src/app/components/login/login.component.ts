// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AccountService } from '../../services/account-service/account.service';
// import { MessageService } from 'primeng/api';
// import { ToastModule } from 'primeng/toast';

// @Component({
//   selector: 'app-login',
//   imports: [CommonModule,FormsModule,ReactiveFormsModule,ToastModule],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss',
//   providers: [MessageService]
  
// })
// export class LoginComponent {
//   loginForm!: FormGroup;
//   showPassword: boolean = false;
//   loginLoading: boolean = false;
//   constructor(private formBuilder: FormBuilder,private router: Router,private accountService:AccountService,private messageService: MessageService) { }
  
//   ngOnInit() {
//      this.loginForm = this.formBuilder.group({
//       email: ['', [Validators.required]],
//       password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
//       rememberMe: [true]
//     });
  
//   }
//   onSubmitLogin() {
//       this.loginLoading = true;
   
//     if (this.loginForm.valid) {
//      this.accountService.login(this.loginForm.value).subscribe(
//         (dt) => {
//           this.router.navigateByUrl('/superAdmin/dashboard');
//           this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User login successfully', life: 3000 });
//           this.loginLoading = false;

//         },
//         (error) => {
//           this.loginLoading = false;
//           this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.message, life: 4000 });
//         }
//       );
//     }
//   }
//    showHidePassword() {
//     this.showPassword = !this.showPassword;
//   }


// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account-service/account.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]

})
export class LoginComponent {
 loginForm!: FormGroup;
  showPassword: boolean = false;
  loginLoading: boolean = false;
  constructor(private formBuilder: FormBuilder,private router: Router,private accountService:AccountService,private messageService: MessageService) { }
  
  ngOnInit() {
     this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      rememberMe: [true]
    });
  
  }
  onSubmitLogin() {
      this.loginLoading = true;
   
    if (this.loginForm.valid) {
     this.accountService.login(this.loginForm.value).subscribe(
        (dt) => {
          this.router.navigateByUrl('/dairyFarm/businessUnit');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User login successfully', life: 3000 });
          this.loginLoading = false;

        },
        (error) => {
          this.loginLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.message, life: 4000 });
        }
      );
    }
  }
   showHidePassword() {
    this.showPassword = !this.showPassword;
  }
}
