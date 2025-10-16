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
import { masterModal } from '../../../../../../models/master-model/master-model';
import {
  FeedConsumptionModel,
  FeedModel,
} from '../../../../../../models/dairy-farm-model/dairy-farm-model';
import { AccountService } from '../../../../../../services/account-service/account.service';
import { MasterService } from '../../../../../../services/master-service/master.service';
import { DairyFarmService } from '../../../../../../services/dairy-farm.service';

@Component({
  selector: 'app-edit-feed-consumption',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    SelectModule,
    RouterLink,
  ],
  templateUrl: './edit-feed-consumption.component.html',
  styleUrl: './edit-feed-consumption.component.scss',
  providers: [MessageService],
})
export class EditFeedConsumptionComponent {
  isReadOnly: boolean = true;
  isActive: boolean = false;
  loading: boolean = false;
  editLoading: boolean = false;
  feedTrackId: any = null;
  businessUnitName: any = '';
  busUnitId: any = null;
  isArchived: boolean = false;
  businessUnitTypes: masterModal[] = [];
  FeedTrackTypesList: masterModal[] = [];
  AnimalList: masterModal[] = [];
  FeedsList: masterModal[] = [];
  isGiven: boolean = true;
  editFeedForm!: FormGroup;

  FeedConsumptionDetail: FeedConsumptionModel = {
    feedTrackId: '',
    feedTrackType: '',
    dateTime: '',
    quantity: 0,
    isGiven: true,
    animalId: '',
    feedId: '',
    feedTrackTypeId: 0,
    note: '',
  };
  constFeedConsumptionDetail: FeedConsumptionModel = {
    feedTrackId: '',
    feedTrackType: '',
    dateTime: '',
    quantity: 0,
    isGiven: true,
    animalId: '',
    feedId: '',
    feedTrackTypeId: 0,
    note: '',
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
    this.feedTrackId = this.route.snapshot.params['id'];
    this.busUnitId = this.accountService.getBusinessUnitId();
    this.businessUnitName = this.accountService.getBusinessUnitName();
    this.getFeedDetails();
    this.initForm();
  }
  getFeedDetails() {
    this.loading = true;
    this.dairyFarmService.GetFeedConsumptionDetail(this.feedTrackId).subscribe(
      (dt) => {
        let data = dt.data;
        this.FeedConsumptionDetail = {
          feedTrackId: data.feedTrackId,
          feedTrackType: data.feedTrackType,
          dateTime: data.dateTime,
          quantity: data.quantity,
          isGiven: data.isGiven,
          animalId: data.animalId,
          feedId: data.feedId,
          feedTrackTypeId: data.feedTrackTypeId,
          note: data.note,
        };
        this.constFeedConsumptionDetail = {
          feedTrackId: data.feedTrackId,
          feedTrackType: data.feedTrackType,
          dateTime: data.dateTime,
          quantity: data.quantity,
          isGiven: data.isGiven,
          animalId: data.animalId,
          feedId: data.feedId,
          feedTrackTypeId: data.feedTrackTypeId,
          note: data.note,
        };
        this.initForm();
        this.loadFeedTrackTypes();
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
      .UpdateFeedDetail(this.feedTrackId, this.editFeedForm.value)
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
    this.FeedConsumptionDetail = {
      feedTrackId: this.constFeedConsumptionDetail.feedTrackId,
      feedTrackType: this.constFeedConsumptionDetail.feedTrackType,
      dateTime: this.constFeedConsumptionDetail.dateTime,
      quantity: this.constFeedConsumptionDetail.quantity,
      isGiven: this.constFeedConsumptionDetail.isGiven,
      animalId: this.constFeedConsumptionDetail.animalId,
      feedId: this.constFeedConsumptionDetail.feedId,
      feedTrackTypeId: this.constFeedConsumptionDetail.feedTrackTypeId,
      note: this.constFeedConsumptionDetail.note,
    };
    this.isReadOnly = true;
    this.initForm();
  }
  initForm() {
    this.editFeedForm = this.formBuilder.group({
      feedTrackId: [
        this.FeedConsumptionDetail.feedTrackId,
        [Validators.required],
      ],
      quantity: [
        this.FeedConsumptionDetail.quantity,
        [Validators.pattern('^[1-9][0-9]*$'), Validators.min(1)],
      ],
      dateTime: [this.FeedConsumptionDetail.dateTime, [Validators.required]],
      isGiven: [this.FeedConsumptionDetail.isGiven],
      animalId: [this.FeedConsumptionDetail.animalId, [Validators.required]],
      feedId: [this.FeedConsumptionDetail.feedId, [Validators.required]],
      feedTrackTypeId: [
        this.FeedConsumptionDetail.feedTrackTypeId,
        [Validators.required],
      ],
      note: [this.FeedConsumptionDetail.note],
    });
  }

  loadFeedTrackTypes() {
    this.masterService.getFeedTrackTypes().subscribe(
      (res) => {
        let dt = res.data;
        this.FeedTrackTypesList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].feedTrackTypeId,
            type: dt[a].name,
          };
          this.FeedTrackTypesList.push(_data);
        }
        this.loadAnimal();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadAnimal() {
    this.masterService.getAnimal().subscribe(
      (res) => {
        let dt = res.data;
        this.AnimalList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].animalId,
            type: dt[a].animalRef,
          };
          this.AnimalList.push(_data);
        }
        this.loadFeeds();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  loadFeeds() {
    this.masterService.getFeeds().subscribe(
      (res) => {
        let dt = res.data;
        this.FeedsList = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].feedId,
            type: dt[a].name,
          };
          this.FeedsList.push(_data);
        }
        this.loadFeedTrackTypes();
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
