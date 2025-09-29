import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { AccountService } from '../../../../../services/account-service/account.service';
import { MasterService } from '../../../../../services/master-service/master.service';
import { masterModal } from '../../../../../models/master-model/master-model';
import { FeedModel } from '../../../../../models/dairy-farm-model/dairy-farm-model';
import { DairyFarmService } from '../../../../../services/dairy-farm.service';

@Component({
  selector: 'app-edit-feed',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    SelectModule,
    RouterLink,
  ],
  templateUrl: './edit-feed.component.html',
  styleUrl: './edit-feed.component.scss',
  providers: [MessageService],
})
export class EditFeedComponent {
  isReadOnly: boolean = true;
  isActive: boolean = false;
  loading: boolean = false;
  editLoading: boolean = false;
  feedId: any = null;
  businessUnitName: any = '';
  busUnitId: any = null;
  isArchived: boolean = false;
  businessUnitTypes: masterModal[] = [];
  AnimalTypes: masterModal[] = [];
  SupplierList: masterModal[] = [];

  editFeedForm!: FormGroup;
  FeedDetail: FeedModel = {
    feedId: '',
    feedRef: '',
    animalRef: '',
    supplierName: '',
    businessUnit: '',
    animalId: '',
    supplierId: '',
    name: '',
    quantity: 0,
    feedTime: '',
    note: '',
    businessUnitId: '',
  };
  constFeedDetail: FeedModel = {
    feedId: '',
    feedRef: '',
    animalRef: '',
    supplierName: '',
    businessUnit: '',
    animalId: '',
    supplierId: '',
    name: '',
    quantity: 0,
    feedTime: '',
    note: '',
    businessUnitId: '',
  };
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private accountService: AccountService,
    private masterService: MasterService,
    private dairyFarmService: DairyFarmService
  ) {}
  ngOnInit() {
    this.feedId = this.route.snapshot.params['id'];
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();
    this.getFeedDetails();
    this.initForm();
  }

  getFeedDetails() {
    this.loading = true;
    this.dairyFarmService.GetFeedDetail(this.feedId).subscribe(
      (dt) => {
        let data = dt.data;
        this.FeedDetail = {
          feedId: data.feedId,
          feedRef: data.feedRef,
          animalId: data.animalId,
          animalRef: data.animalRef,
          supplierId: data.supplierId,
          supplierName: data.supplierName,
          businessUnit: data.businessUnit,
          name: data.name,
          quantity: data.quantity,
          feedTime: data.feedTime,
          note: data.note,
          businessUnitId: data.businessUnitId,
        };
        this.constFeedDetail = {
          feedId: data.feedId,
          feedRef: data.feedRef,
          animalId: data.animalId,
          animalRef: data.animalRef,
          supplierId: data.supplierId,
          supplierName: data.supplierName,
          businessUnit: data.businessUnit,
          name: data.name,
          quantity: data.quantity,
          feedTime: data.feedTime,
          note: data.note,
          businessUnitId: data.businessUnitId,
        };
        this.initForm();
        this.loadAnimalTypes();
        this.loadParties();
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
        }
      }
    );
  }
  editFeedDetail() {
    this.editLoading = true;
    this.dairyFarmService
      .UpdateFeedDetail(this.feedId, this.editFeedForm.value)
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Feed updated successfully',
            life: 3000,
          });
          this.getFeedDetails();
          this.editLoading = false;
          this.isReadOnly = true;
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
    this.FeedDetail = {
      feedId: this.constFeedDetail.feedId,
      feedRef: this.constFeedDetail.feedRef,
      animalId: this.constFeedDetail.animalId,
      animalRef: this.constFeedDetail.animalRef,
      quantity: this.constFeedDetail.quantity,
      supplierId: this.constFeedDetail.supplierId,
      supplierName: this.constFeedDetail.supplierName,
      name: this.constFeedDetail.name,
      feedTime: this.constFeedDetail.feedTime,
      note: this.constFeedDetail.note,
      businessUnit: this.constFeedDetail.businessUnit,
      businessUnitId: this.constFeedDetail.businessUnitId,
    };
    this.isReadOnly = true;
    this.initForm();
  }
  initForm() {
    this.editFeedForm = this.formBuilder.group({
      businessUnitId: [this.busUnitId],
      animalId: [this.FeedDetail.animalId, [Validators.required]],
      supplierId: [this.FeedDetail.supplierId, [Validators.required]],
      name: [this.FeedDetail.name, [Validators.required]],
      quantity: [
        this.FeedDetail.quantity,
        [Validators.pattern('^[1-9][0-9]*$'), Validators.min(1)],
      ],
      feedTime: [this.FeedDetail.feedTime, [Validators.required]],
      note: [this.FeedDetail.note],
    });
  }

  loadAnimalTypes() {
    this.masterService.getAnimalTypes().subscribe(
      (res) => {
        let dt = res.data;
        this.AnimalTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.AnimalTypes.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadParties() {
    this.masterService.getParties(1).subscribe(
      (res) => {
        var dt = res;
        this.SupplierList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].partyId,
            type: dt[a].name,
          };
          this.SupplierList.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  goBack() {
    this.location.back();
  }
}
