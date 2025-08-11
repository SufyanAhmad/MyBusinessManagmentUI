import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { DairyFarmService } from './../../../../services/dairy-farm.service';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../../../services/account-service/account.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dairy-farm-business',
  imports: [CommonModule,SkeletonModule, FormsModule,
  ReactiveFormsModule,
    DialogModule],
  templateUrl: './dairy-farm-business.component.html',
  styleUrl: './dairy-farm-business.component.scss',
  providers: [MessageService],
  
})
export class DairyFarmBusinessComponent {
loading:boolean=false;
addLoading: boolean = false;
visible:boolean=false;
addDairyFarmBusinessModel!: FormGroup;
 constructor(
    private formBuilder: FormBuilder,
    private dairyFarmService:DairyFarmService,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router

  ) {}
ngOnInit(){
  this.initForm();
}
  initForm() {
    this.addDairyFarmBusinessModel = this.formBuilder.group({
      name: [null, [Validators.required]],
      location: [null, [Validators.required]],
      businessTypeId: [3, [Validators.required]],
    });
  }
   addDairyFarmBusinessUnit() {
    this.addLoading = true;
    this.dairyFarmService
      .addBusinessUnit(this.addDairyFarmBusinessModel.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          // this.getBusinessUnits();
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Dairy farm business unit added successfully',
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
}
