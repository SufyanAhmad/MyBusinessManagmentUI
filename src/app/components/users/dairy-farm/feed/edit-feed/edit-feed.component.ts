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
    businessUnit: '',
    feedType: '',
    name: '',
    businessUnitId: '',
    quantity: 0,
    date: '',
    expiryDate: '',
    note: '',
    feedTypeId: 0,
  };
  constFeedDetail: FeedModel = {
    feedId: '',
    businessUnit: '',
    feedType: '',
    name: '',
    businessUnitId: '',
    quantity: 0,
    date: '',
    expiryDate: '',
    note: '',
    feedTypeId: 0,
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
          businessUnit: data.businessUnit,
          feedType: data.feedType,
          name: data.name,
          businessUnitId: data.businessUnitId,
          quantity: data.quantity,
          date: data.date,
          expiryDate: data.expiryDate,
          feedTypeId: data.feedTypeId,
          note: data.note,
        };
        this.constFeedDetail = {
          feedId: data.feedId,
          businessUnit: data.businessUnit,
          feedType: data.feedType,
          name: data.name,
          businessUnitId: data.businessUnitId,
          quantity: data.quantity,
          date: data.date,
          expiryDate: data.expiryDate,
          feedTypeId: data.feedTypeId,
          note: data.note,
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
      businessUnit: this.constFeedDetail.businessUnit,
      feedType: this.constFeedDetail.feedType,
      name: this.constFeedDetail.name,
      quantity: this.constFeedDetail.quantity,
      businessUnitId: this.constFeedDetail.businessUnitId,
      date: this.constFeedDetail.date,
      note: this.constFeedDetail.note,
      expiryDate: this.constFeedDetail.expiryDate,
      feedTypeId: this.constFeedDetail.feedTypeId,
    };
    this.isReadOnly = true;
    this.initForm();
  }
  initForm() {
    this.editFeedForm = this.formBuilder.group({
      name: [this.FeedDetail.name, [Validators.required]],
      businessUnitId: [this.busUnitId],
      quantity: [
        this.FeedDetail.quantity,
        [Validators.pattern('^[1-9][0-9]*$'), Validators.min(1)],
      ],
      date: [this.FeedDetail.date, [Validators.required]],
      expiryDate: [this.FeedDetail.expiryDate],
      feedTypeId: [this.FeedDetail.feedTypeId, [Validators.required]],
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
