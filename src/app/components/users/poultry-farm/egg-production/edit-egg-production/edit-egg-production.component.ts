import { Component } from '@angular/core';
import { eggProductionModel } from '../../../../../models/poultry-farm-model/poultry-farm-model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PoultryFarmService } from '../../../../../services/poultry-farm-service/poultry-farm.service';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../../../../services/account-service/account.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-edit-egg-production',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    SelectModule,
    CheckboxModule,
    Skeleton,
    RouterLink
  ],
  templateUrl: './edit-egg-production.component.html',
  styleUrl: './edit-egg-production.component.scss',
  providers: [MessageService],
})
export class EditEggProductionComponent {
  isReadOnly: boolean = true;
  loading: boolean = false;
  editLoading: boolean = false;
  eggProductionId: any = null;
  busUnitId: any = null;
  businessUnitName: any = null;
  eggProductionDetail: eggProductionModel = {
    eggProductionId: '',
    refCount: 0,
    ref: '',
    businessUnitName: '',
    flockRef: '',
    createdAt: '',
    createdBy: '',
    flockId: '',
    businessUnitId: '',
    totalEggs: 0,
    fertileEggs: 0,
    brokenEggs: 0,
    date: '',
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private poultryFarmService: PoultryFarmService,
    private messageService: MessageService,
    private accountService: AccountService,
    private location: Location
  ) {}
  ngOnInit() {
    this.eggProductionId = this.route.snapshot.params['id'];
    this.busUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    this.getVaccinationDetail();
  }

  getVaccinationDetail() {
    this.loading = true;
    this.poultryFarmService.geEggProductionById(this.eggProductionId).subscribe(
      (dt) => {
        let data = dt.data;
        this.eggProductionDetail = {
          eggProductionId: data.eggProductionId,
          refCount: data.refCount,
          ref: data.ref,
          createdAt: data.createdAt?.split('T')[0],
          createdBy: data.createdBy,
          businessUnitName: data.businessUnitName,
          businessUnitId: data.businessUnitId,
          flockRef: data.flockRef,
          flockId: data.flockId,
          totalEggs: data.totalEggs,
          fertileEggs: data.fertileEggs,
          brokenEggs: data.brokenEggs,
          date: data.date?.split('T')[0],
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
