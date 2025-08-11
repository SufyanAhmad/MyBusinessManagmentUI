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
import { feedRecordModel } from '../../../../../models/poultry-farm-model/poultry-farm-model';
import { PoultryFarmService } from '../../../../../services/poultry-farm-service/poultry-farm.service';

@Component({
  selector: 'app-edit-feed-record',
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
  templateUrl: './edit-feed-record.component.html',
  styleUrl: './edit-feed-record.component.scss',
  providers: [MessageService],
})
export class EditFeedRecordComponent {
  isReadOnly: boolean = true;
  loading: boolean = false;
  editLoading: boolean = false;
  flockId: any = null;
  busUnitId: any = null;
  businessUnitName: any = null;
  feedRecordDetail: feedRecordModel = {
    feedRecordId: '',
    ref: '',
    flockId: '',
    flockRef: '',
    date: '',
    feedTypeId: 0,
    feedType: '',
    quantityKg: 0,
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
    this.getFeedRecordDetail();
  }

  getFeedRecordDetail() {
    this.loading = true;
    this.poultryFarmService.getFeedRecordById(this.flockId).subscribe(
      (dt) => {
        let data = dt.data;
        this.feedRecordDetail = {
          feedRecordId: data.feedRecordId,
          ref: data.ref,
          flockId: data.flockId,
          flockRef: data.flockRef,
          date: data.date?.split('T')[0],
          feedTypeId: data.feedTypeId,
          feedType: data.feedType,
          quantityKg: data.quantityKg,
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
