import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { Skeleton } from 'primeng/skeleton';
import { AccountService } from '../../../../../services/account-service/account.service';
import { flockModel } from '../../../../../models/poultry-farm-model/poultry-farm-model';
import { PoultryFarmService } from '../../../../../services/poultry-farm-service/poultry-farm.service';

@Component({
  selector: 'app-edit-flocks',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    ToastModule,
    SelectModule,
    CheckboxModule,
    Skeleton,
  ],
  templateUrl: './edit-flocks.component.html',
  styleUrl: './edit-flocks.component.scss',
  providers: [MessageService],
})
export class EditFlocksComponent {
  isReadOnly: boolean = true;
  loading: boolean = false;
  editLoading: boolean = false;
  flockId: any = null;
  busUnitId: any = null;
  businessUnitName: any = null;
  flockDetail: flockModel = {
    flockId: '',
    ref: '',
    breed: '',
    quantity: 0,
    arrivalDate: '',
    isHen: false,
    businessUnitId: '',
    businessUnit: '',
    price: 0,
    supplierId: '',
    supplier: '',
  };

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private poultryFarmService: PoultryFarmService,
    private messageService: MessageService,
    private accountService: AccountService
  ) {}
  ngOnInit() {
    this.flockId = this.route.snapshot.params['id'];
    this.busUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    this.getFlockDetail();
  }

  getFlockDetail() {
    this.loading = true;
    this.poultryFarmService.geFlockById(this.flockId).subscribe(
      (dt) => {
        let data = dt.data;
        this.flockDetail = {
          flockId: data.flockId,
          ref: data.ref,
          breed: data.breed,
          quantity: data.quantity,
          arrivalDate: data.arrivalDate?.split('T')[0],
          isHen: data.isHen,
          businessUnitId: data.businessUnitId,
          businessUnit: data.businessUnit,
          price: data.price,
          supplierId: data.supplierId,
          supplier: data.supplier,
        };
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 4000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  goBack() {
    this.location.back();
  }
}
