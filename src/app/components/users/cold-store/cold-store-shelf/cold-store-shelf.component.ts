import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { Router, RouterLink } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import {
  addTypeVarietyUnitModel,
  ClodStoreShelfModel,
  roomModel,
} from '../../../../models/cold-store-model/cold-store-model';
import { SuperAdminService } from '../../../../services/super-admin-service/super-admin.service';
import { AccountService } from '../../../../services/account-service/account.service';
import { DataNotFoundComponent } from '../../../data-not-found/data-not-found.component';
import { LoadingComponent } from '../../../loading/loading.component';
import {
  masterModal,
  SettingModel,
} from '../../../../models/master-model/master-model';
import { MasterService } from '../../../../services/master-service/master.service';
import { ColdStoreServiceService } from '../../../../services/cold-store-service/cold-store-service.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmationPopupComponent } from '../../../confirmation-popup/confirmation-popup.component';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-cold-store-shelf',
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    CommonModule,
    CheckboxModule,
    SelectModule,
    DataNotFoundComponent,
    LoadingComponent,
    ToastModule,
    ConfirmationPopupComponent,
    Skeleton,
  ],
  templateUrl: './cold-store-shelf.component.html',
  styleUrl: './cold-store-shelf.component.scss',
  providers: [MessageService],
})
export class ColdStoreShelfComponent {
  searchKey: any = null;
  isLoadingResults: boolean = false;
  eggTypeLoading: boolean = false;
  potatoTypeLoading: boolean = false;
  eggUnitLoading: boolean = false;
  potatoUnitLoading: boolean = false;
  eggVarietyLoading: boolean = false;
  potatoVarietyLoading: boolean = false;
  employeeTypeLoading: boolean = false;
  categoryTypeLoading: boolean = false;
  roomLoading: boolean = false;
  detailLoading: boolean = false;
  businessUnitTypes: masterModal[] = [];
  productTypes: masterModal[] = [];
  visible: boolean = false;
  isAddRoomPopup: boolean = false;
  isAddTypeVarietyUnit: boolean = false;
  isAddProduct: boolean = false;
  isEditTypeVarietyUnitPopup: boolean = false;
  showConfirmDialog: boolean = false;
  confirmationMessage: string = '';
  roomConfirmDialog: boolean = false;
  roomConfirmMessage: string = '';
  showDeleteConfirmationDialog: boolean = false;
  deleteConfirmationMessage: string = '';
  addLoading: boolean = false;
  businessUnitId: any = null;
  _businessUnitId: any = null;
  coldStoreShelfId: any = null;
  roomId: any = null;
  deletedItemId: any = null;
  deletedItemType: string = '';
  roomName: any = null;
  ProductName: any = null;
  archivedStatus: boolean = false;
  businessUnitName: any = '';
  dialogHeader: any = '';
  popupLabelTitle: any = '';
  popupPlaceholder: any = '';
  inputType: any = 'text';
  popupType: any = '';
  addColdStoreShelfModel!: FormGroup;
  addTypeVarietyUnitModel!: FormGroup;
  addProductModel!: FormGroup;
  editTypeVarietyUnitModel!: FormGroup;
  showConfirmationDialog: boolean = false;
  displayedRackColumns: string[] = [
    'shelfNo',
    'name',
    'capacity',
    'occupy',
    'business',
    'dlt',
  ];
  displayedRoomColumns: string[] = ['roomNo', 'name', 'occupy', 'status'];
  displayedTypeColumns: string[] = ['typeNo', 'name', 'dlt'];
  displayedUnitColumns: string[] = ['unitNo', 'name', 'dlt'];
  displayedVarietyColumns: string[] = ['varietyNo', 'name', 'dlt'];
  displayedEmployeeColumns: string[] = ['varietyNo', 'name', 'dlt'];
  displayedProductsColumns: string[] = ['productId', 'name'];

  coldStoreShelfList: ClodStoreShelfModel[] = [];
  roomList: roomModel[] = [];
  eggTypes: SettingModel[] = [];
  potatoTypes: SettingModel[] = [];
  eggUnits: SettingModel[] = [];
  potatoUnits: SettingModel[] = [];
  eggVarieties: SettingModel[] = [];
  potatoVarieties: SettingModel[] = [];
  employeeTypes: SettingModel[] = [];
  categoryTypes: SettingModel[] = [];
  products: masterModal[] = [];

  employeeTypesDataSource!: MatTableDataSource<SettingModel>;
  dataSource!: MatTableDataSource<ClodStoreShelfModel>;
  roomDataSource!: MatTableDataSource<roomModel>;
  eggTypeDataSource!: MatTableDataSource<SettingModel>;
  potatoTypeDataSource!: MatTableDataSource<SettingModel>;
  eggUnitDataSource!: MatTableDataSource<SettingModel>;
  potatoUnitDataSource!: MatTableDataSource<SettingModel>;
  eggVarietyDataSource!: MatTableDataSource<SettingModel>;
  potatoVarietyDataSource!: MatTableDataSource<SettingModel>;
  categoryDataSource!: MatTableDataSource<SettingModel>;
  productsDataSource!: MatTableDataSource<masterModal>;

  typeVarietyUnitDetail: addTypeVarietyUnitModel = {
    id: 0,
    value: '',
    productTypeId: 0,
  };
  constructor(
    private formBuilder: FormBuilder,
    private masterService: MasterService,
    private superAdminService: SuperAdminService,
    private coldStoreService: ColdStoreServiceService,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router
  ) {}
  ngOnInit() {
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    this._businessUnitId = localStorage.getItem('BS_businessUnitId');
    this.initForm();
    this.initTypeVarietyUnitForm();
    this.editTypeVarietyUnitForm();
    this.getRoomList();
    this.loadBusinessUnitTypes();
    this.getEggTypes();
    this.getPotatoTypes();
    this.getEggUnit();
    this.getPotatoUnits();
    this.getEggVariety();
    this.getPotatoVariety();
    this.getEmployeeTypes();
    this.getCategoryTypes();
    this.loadProducts();
    this.initProductForm();
  }
  initForm() {
    this.addColdStoreShelfModel = this.formBuilder.group({
      shelfName: [null, [Validators.required]],
      capacityCubicFeet: [null],
      businessUnitId: [this._businessUnitId, [Validators.required]],
    });
  }
  initTypeVarietyUnitForm() {
    this.addTypeVarietyUnitModel = this.formBuilder.group({
      id: [null],
      value: [null, [Validators.required]],
      productTypeId: [null, [Validators.required]],
    });
  }
  initProductForm() {
    this.addProductModel = this.formBuilder.group({
      // id: [null],
      value: [null, [Validators.required]],
      // productTypeId: [null, [Validators.required]],
    });
  }
  editTypeVarietyUnitForm() {
    this.editTypeVarietyUnitModel = this.formBuilder.group({
      id: [this.typeVarietyUnitDetail.id],
      value: [this.typeVarietyUnitDetail.value, [Validators.required]],
      productTypeId: [
        this.typeVarietyUnitDetail.productTypeId,
        [Validators.required],
      ],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getColdStoreShelfList();
    }, 0);
  }

  getColdStoreShelfList() {
    this.isLoadingResults = true;
    this.coldStoreShelfList = [];
    this.dataSource = new MatTableDataSource(this.coldStoreShelfList);
    let data = {
      searchKey: null,
      businessUnitId: this._businessUnitId,
      isOccupied: null,
      archived: null,
      pageNumber: 1,
      pageSize: 100,
    };
    this.superAdminService.getColdStoreShelf(data).subscribe(
      (data) => {
        this.coldStoreShelfList = [];
        this.dataSource = new MatTableDataSource(this.coldStoreShelfList);
        let dt = data.list;
        for (let a = 0; a < dt.length; a++) {
          let shelf: ClodStoreShelfModel = {
            coldStoreShelfId: dt[a].coldStoreShelfId,
            businessUnitId: dt[a].businessUnitId,
            businessUnit: dt[a].businessUnit,
            shelfName: dt[a].shelfName,
            coldStoreShelfNo: dt[a].coldStoreShelfNo,
            capacityCubicFeet: dt[a].capacityCubicFeet,
            isOccupied: dt[a].isOccupied,
            archived: dt[a].archived,
          };
          this.coldStoreShelfList.push(shelf);
        }
        this.dataSource = new MatTableDataSource(this.coldStoreShelfList);
        this.isLoadingResults = false;
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  getRoomList() {
    this.roomLoading = true;
    this.roomList = [];
    this.roomDataSource = new MatTableDataSource(this.roomList);
    let data = {
      searchKey: null,
      businessUnitId: this._businessUnitId,
      isOccupied: null,
      archived: null,
      pageNumber: 1,
      pageSize: 100,
    };
    this.superAdminService.getRooms(data).subscribe(
      (data) => {
        this.roomList = [];
        this.roomDataSource = new MatTableDataSource(this.roomList);
        let dt = data.list;
        for (let a = 0; a < dt.length; a++) {
          let room: roomModel = {
            roomId: dt[a].roomId,
            roomNo: dt[a].roomNo,
            isArchived: dt[a].isArchived,
            isOccupied: dt[a].isOccupied,
            name: dt[a].name,
            businessUnitId: dt[a].name,
          };
          this.roomList.push(room);
        }
        this.roomDataSource = new MatTableDataSource(this.roomList);
        this.roomLoading = false;
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  SearchBySearchKey(event: any) {
    if (event.key != 'Enter') {
      if (this.searchKey == '' || this.searchKey == null) {
        this.searchKey = null;
      }
    }
  }
  loadProductTypes() {
    this.masterService.getProductTypes().subscribe(
      (res) => {
        var dt = res;
        this.productTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].key,
            type: dt[a].value,
          };
          this.productTypes.push(_data);
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }

  addColdStoreShelf() {
    this.addLoading = true;
    console.log(this.addColdStoreShelfModel.value);

    this.coldStoreService
      .addColdStoreShelf(this.addColdStoreShelfModel.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          this.visible = false;
          this.getColdStoreShelfList();
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Cold store shelf added successfully',
            life: 3000,
          });
        },
        (error) => {
          this.addLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 3000,
          });
          if (error.status == 401) {
            this.accountService.doLogout();
            this.router.navigateByUrl('/');
          }
        }
      );
  }
  addRoom() {
    this.addLoading = true;
    let data = {
      name: this.roomName,
      businessUnitId: this._businessUnitId,
    };
    this.coldStoreService.addRoom(data).subscribe(
      (dt) => {
        this.addLoading = false;
        this.isAddRoomPopup = false;
        this.getRoomList();
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Room added successfully',
          life: 3000,
        });
      },
      (error) => {
        this.addLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  onSaveClick() {
    if (this.popupType == 'type') {
      this.addType();
    } else if (this.popupType == 'unit') {
      this.addUnit();
    } else if (this.popupType == 'variety') {
      this.addVariety();
    } else if (this.popupType == 'employee') {
      this.addEmployeeType();
    } else if (this.popupType == 'category') {
      this.addCategoryType();
    } else if (this.popupType == 'product') {
      this.addProduct();
    }
  }

  onEditClick() {
    if (this.popupType == 'editType') {
      this.editTypeDetail();
    } else if (this.popupType == 'editUnit') {
      this.editUnitDetail();
    } else if (this.popupType == 'editVariety') {
      this.editVarietyDetail();
    } else if (this.popupType == 'editEmployee') {
      this.editEmployeeDetail();
    }
  }
  addType() {
    this.addLoading = true;
    this.coldStoreService.AddType(this.addTypeVarietyUnitModel.value).subscribe(
      (dt) => {
        if (dt.productTypeId == 1) {
          this.getEggTypes();
        } else {
          this.getPotatoTypes();
        }
        this.addLoading = false;
        this.isAddTypeVarietyUnit = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Type added successfully',
          life: 3000,
        });
      },
      (error) => {
        this.addLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  addUnit() {
    this.addLoading = true;
    this.coldStoreService.AddUnit(this.addTypeVarietyUnitModel.value).subscribe(
      (dt) => {
        if (dt.productTypeId == 1) {
          this.getEggUnit();
        } else {
          this.getPotatoUnits();
        }
        this.addLoading = false;
        this.isAddTypeVarietyUnit = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Units added successfully',
          life: 3000,
        });
      },
      (error) => {
        this.addLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  addVariety() {
    this.addLoading = true;
    this.coldStoreService
      .AddVariety(this.addTypeVarietyUnitModel.value)
      .subscribe(
        (dt) => {
          this.addLoading = false;
          if (dt.productTypeId == 1) {
            this.getEggVariety();
          } else {
            this.getPotatoVariety();
          }
          this.isAddTypeVarietyUnit = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Added',
            detail: 'Variety added successfully',
            life: 3000,
          });
        },
        (error) => {
          this.addLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 3000,
          });
          if (error.status == 401) {
            this.accountService.doLogout();
            this.router.navigateByUrl('/');
          }
        }
      );
  }
  addEmployeeType() {
    this.addLoading = true;
    let data = {
      name: this.addTypeVarietyUnitModel.value.value,
    };
    this.coldStoreService.AddEmployeeType(data).subscribe(
      (dt) => {
        this.addLoading = false;
        this.getEmployeeTypes();
        this.isAddTypeVarietyUnit = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Employee type added successfully',
          life: 3000,
        });
      },
      (error) => {
        this.addLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  addCategoryType() {
    this.addLoading = true;
    let data = {
      name: this.addTypeVarietyUnitModel.value.value,
    };
    this.coldStoreService.AddCategory(data).subscribe(
      (dt) => {
        this.getCategoryTypes();
        this.addLoading = false;
        this.isAddTypeVarietyUnit = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Category added successfully',
          life: 3000,
        });
      },
      (error) => {
        this.addLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }

  // update types
  editTypeDetail() {
    this.addLoading = true;
    let data = {
      typeId: this.editTypeVarietyUnitModel.value.id,
      value: this.editTypeVarietyUnitModel.value.value,
      productTypeId: this.editTypeVarietyUnitModel.value.productTypeId,
    };
    this.coldStoreService.updateTypeDetail(data).subscribe(
      (dt) => {
        if (dt.productTypeId == 1) {
          this.getEggTypes();
        } else {
          this.getPotatoTypes();
        }
        this.addLoading = false;
        this.isEditTypeVarietyUnitPopup = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Type updated successfully',
          life: 3000,
        });
      },
      (error) => {
        this.addLoading = false;
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
  // update Units
  editUnitDetail() {
    this.addLoading = true;
    let data = {
      unitId: this.editTypeVarietyUnitModel.value.id,
      value: this.editTypeVarietyUnitModel.value.value,
      productTypeId: this.editTypeVarietyUnitModel.value.productTypeId,
    };
    this.coldStoreService.updateUnitDetail(data).subscribe(
      (dt) => {
        if (dt.productTypeId == 1) {
          this.getEggUnit();
        } else {
          this.getPotatoUnits();
        }
        this.addLoading = false;
        this.isEditTypeVarietyUnitPopup = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Unit updated successfully',
          life: 3000,
        });
      },
      (error) => {
        this.addLoading = false;
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
  // update Variety
  editVarietyDetail() {
    this.addLoading = true;
    let data = {
      varietyId: this.editTypeVarietyUnitModel.value.id,
      value: this.editTypeVarietyUnitModel.value.value,
      productTypeId: this.editTypeVarietyUnitModel.value.productTypeId,
    };
    this.coldStoreService.updateVarietyDetail(data).subscribe(
      (dt) => {
        if (dt.productTypeId == 1) {
          this.getEggVariety();
        } else {
          this.getPotatoVariety();
        }
        this.addLoading = false;
        this.isEditTypeVarietyUnitPopup = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Variety updated successfully',
          life: 3000,
        });
      },
      (error) => {
        this.addLoading = false;
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
  editEmployeeDetail() {
    this.addLoading = true;
    let data = {
      employeeTypeId: this.editTypeVarietyUnitModel.value.id,
      name: this.editTypeVarietyUnitModel.value.value,
    };
    this.coldStoreService.updateEmployeeDetail(data).subscribe(
      (dt) => {
        this.getEmployeeTypes();
        this.addLoading = false;
        this.isEditTypeVarietyUnitPopup = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Employee type updated successfully',
          life: 3000,
        });
      },
      (error) => {
        this.addLoading = false;
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
  loadBusinessUnitTypes() {
    this.masterService.getBusinessUnitTypes().subscribe(
      (res) => {
        var dt = res;
        this.businessUnitTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].businessUnitId,
            type: dt[a].name,
          };
          this.businessUnitTypes.push(_data);
        }
        this.loadProductTypes();
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  //  get Employee type
  getEmployeeTypes() {
    this.employeeTypeLoading = true;
    this.employeeTypes = [];
    this.employeeTypesDataSource = new MatTableDataSource(this.employeeTypes);
    this.coldStoreService.getEmployeeTypesWithFlag().subscribe(
      (res) => {
        var dt = res;
        this.employeeTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: SettingModel = {
            id: dt[a].employeeTypeId,
            type: dt[a].name,
            isActive: dt[a].isActive,
          };
          this.employeeTypes.push(_data);
        }
        this.employeeTypesDataSource = new MatTableDataSource(
          this.employeeTypes
        );
        this.employeeTypeLoading = false;
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  //  get egg type
  getEggTypes() {
    this.eggTypeLoading = true;
    this.eggTypes = [];
    this.eggTypeDataSource = new MatTableDataSource(this.eggTypes);
    this.coldStoreService.getTypesWithFlag(1).subscribe(
      (res) => {
        var dt = res;
        this.eggTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: SettingModel = {
            id: dt[a].typeId,
            orderNumber: dt[a].orderNumber,
            type: dt[a].value,
            isActive: dt[a].isActive,
          };
          this.eggTypes.push(_data);
        }
        this.eggTypeDataSource = new MatTableDataSource(this.eggTypes);
        this.eggTypeLoading = false;
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  //  get potato type
  getPotatoTypes() {
    this.potatoTypeLoading = true;
    this.potatoTypes = [];
    this.potatoTypeDataSource = new MatTableDataSource(this.potatoTypes);
    this.coldStoreService.getTypesWithFlag(0).subscribe(
      (res) => {
        var dt = res;
        this.potatoTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: SettingModel = {
            id: dt[a].typeId,
            orderNumber: dt[a].orderNumber,
            type: dt[a].value,
            isActive: dt[a].isActive,
          };
          this.potatoTypes.push(_data);
        }
        this.potatoTypeDataSource = new MatTableDataSource(this.potatoTypes);
        this.potatoTypeLoading = false;
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  //  get egg unit
  getEggUnit() {
    this.eggUnitLoading = true;
    this.eggUnits = [];
    this.eggUnitDataSource = new MatTableDataSource(this.eggUnits);
    this.coldStoreService.getUnitsWithFlag(1).subscribe(
      (res) => {
        var dt = res;
        this.eggUnits = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: SettingModel = {
            id: dt[a].unitId,
            orderNumber: dt[a].orderNumber,
            type: dt[a].value,
            isActive: dt[a].isActive,
          };
          this.eggUnits.push(_data);
        }
        this.eggUnitDataSource = new MatTableDataSource(this.eggUnits);
        this.eggUnitLoading = false;
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  //  get potato unit
  getPotatoUnits() {
    this.potatoUnitLoading = true;
    this.potatoUnits = [];
    this.potatoUnitDataSource = new MatTableDataSource(this.potatoUnits);
    this.coldStoreService.getUnitsWithFlag(0).subscribe(
      (res) => {
        var dt = res;
        this.potatoUnits = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: SettingModel = {
            id: dt[a].unitId,
            orderNumber: dt[a].orderNumber,
            type: dt[a].value,
            isActive: dt[a].isActive,
          };
          this.potatoUnits.push(_data);
        }
        this.potatoUnitDataSource = new MatTableDataSource(this.potatoUnits);
        this.potatoUnitLoading = false;
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  //  get egg Variety
  getEggVariety() {
    this.eggVarietyLoading = true;
    this.eggVarieties = [];
    this.eggVarietyDataSource = new MatTableDataSource(this.eggVarieties);
    this.coldStoreService.getVarietiesWithFlag(1).subscribe(
      (res) => {
        var dt = res;
        this.eggVarieties = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: SettingModel = {
            id: dt[a].varietyId,
            orderNumber: dt[a].orderNumber,
            type: dt[a].value,
            isActive: dt[a].isActive,
          };
          this.eggVarieties.push(_data);
        }
        this.eggVarietyDataSource = new MatTableDataSource(this.eggVarieties);
        this.eggVarietyLoading = false;
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  //  get potato Variety
  getPotatoVariety() {
    this.potatoVarietyLoading = true;
    this.potatoVarieties = [];
    this.potatoVarietyDataSource = new MatTableDataSource(this.potatoVarieties);
    this.coldStoreService.getVarietiesWithFlag(0).subscribe(
      (res) => {
        var dt = res;
        this.potatoVarieties = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: SettingModel = {
            id: dt[a].varietyId,
            orderNumber: dt[a].orderNumber,
            type: dt[a].value,
            isActive: dt[a].isActive,
          };
          this.potatoVarieties.push(_data);
        }
        this.potatoVarietyDataSource = new MatTableDataSource(
          this.potatoVarieties
        );
        this.potatoVarietyLoading = false;
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  //  get Category type
  getCategoryTypes() {
    this.categoryTypeLoading = true;
    this.categoryTypes = [];
    this.categoryDataSource = new MatTableDataSource(this.categoryTypes);
    this.coldStoreService.getCategoryWithFlag().subscribe(
      (res) => {
        var dt = res;
        this.categoryTypes = [];
        for (let a = 0; a < dt.length; a++) {
          let _data: SettingModel = {
            id: dt[a].categoryId,
            type: dt[a].name,
            isActive: dt[a].isActive,
          };
          this.categoryTypes.push(_data);
        }
        this.categoryDataSource = new MatTableDataSource(this.categoryTypes);
        this.categoryTypeLoading = false;
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  // edit type status
  editTypesStatus(typeId: any, status: any) {
    this.coldStoreService.updateTypesStatus(typeId, status).subscribe(
      (dt) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Types status update successfully',
          life: 3000,
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  // edit Unit status
  editUnitStatus(typeId: any, status: any) {
    this.coldStoreService.updateUnitsStatus(typeId, status).subscribe(
      (dt) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Unit status update successfully',
          life: 3000,
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  // edit Unit status
  editVarietyStatus(typeId: any, status: any) {
    this.coldStoreService.updateVarietiesStatus(typeId, status).subscribe(
      (dt) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Variety status update successfully',
          life: 3000,
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  // edit Employee status
  editEmployeeStatus(typeId: any, status: any) {
    this.coldStoreService.updateEmployeeStatus(typeId, status).subscribe(
      (dt) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Employee status update successfully',
          life: 3000,
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }

  //get type details
  getTypeDetails(id: any) {
    this.detailLoading = true;
    this.coldStoreService.getTypeDetail(id).subscribe(
      (dt) => {
        let data = dt;
        this.typeVarietyUnitDetail = {
          id: data.typeId,
          value: data.value,
          productTypeId: data.productTypeId,
        };
        this.editTypeVarietyUnitForm();
        this.detailLoading = false;
      },
      (error) => {
        this.detailLoading = false;
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
  //get unit details
  getUnitDetails(id: any) {
    this.detailLoading = true;
    this.coldStoreService.getUnitDetail(id).subscribe(
      (dt) => {
        let data = dt;
        this.typeVarietyUnitDetail = {
          id: data.unitId,
          value: data.value,
          productTypeId: data.productTypeId,
        };
        this.editTypeVarietyUnitForm();
        this.detailLoading = false;
      },
      (error) => {
        this.detailLoading = false;
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
  //get Variety details
  getVarietyDetails(id: any) {
    this.detailLoading = true;
    this.coldStoreService.getVarietyDetail(id).subscribe(
      (dt) => {
        let data = dt;
        this.typeVarietyUnitDetail = {
          id: data.varietyId,
          value: data.value,
          productTypeId: data.productTypeId,
        };
        this.editTypeVarietyUnitForm();
        this.detailLoading = false;
      },
      (error) => {
        this.detailLoading = false;
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
  //get employee details
  getEmployeeDetails(id: any) {
    this.detailLoading = true;
    this.coldStoreService.getEmployeeDetail(id).subscribe(
      (dt) => {
        let data = dt;
        this.typeVarietyUnitDetail = {
          id: data.employeeTypeId,
          value: data.name,
          productTypeId: 1,
        };
        this.editTypeVarietyUnitForm();
        this.detailLoading = false;
      },
      (error) => {
        this.detailLoading = false;
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
  ResetFilter() {
    this.searchKey = null;
    this.businessUnitId = null;
    this.ngAfterViewInit();
  }
  editArchiveStatus() {
    this.showConfirmDialog = false;
    this.coldStoreService
      .updateArchiveStatus(this.coldStoreShelfId, this.archivedStatus)
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Update',
            detail: 'Cold store shelf change archived successfully',
            life: 3000,
          });
          this.getColdStoreShelfList();
        },
        (error) => {
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
  //for open delete conformation popup
  openDeleteConfirmationDialog() {
    if (this.deletedItemType == 'rack') {
      this.deleteConfirmationMessage =
        'Are you sure you want to delete this rack?';
    } else if (this.deletedItemType == 'room') {
      this.deleteConfirmationMessage =
        'Are you sure you want to delete this room?';
    } else if (this.deletedItemType == 'eggType') {
      this.deleteConfirmationMessage =
        'Are you sure you want to delete this egg type?';
    } else if (this.deletedItemType == 'potatoType') {
      this.deleteConfirmationMessage =
        'Are you sure you want to delete this potato type?';
    } else if (this.deletedItemType == 'eggUnit') {
      this.deleteConfirmationMessage =
        'Are you sure you want to delete this egg unit?';
    } else if (this.deletedItemType == 'potatoUnit') {
      this.deleteConfirmationMessage =
        'Are you sure you want to delete this potato unit?';
    } else if (this.deletedItemType == 'eggVariety') {
      this.deleteConfirmationMessage =
        'Are you sure you want to delete this egg variety?';
    } else if (this.deletedItemType == 'potatoVariety') {
      this.deleteConfirmationMessage =
        'Are you sure you want to delete this potato variety?';
    } else {
      this.deleteConfirmationMessage =
        'Are you sure you want to delete this employee type?';
    }

    this.showDeleteConfirmationDialog = true;
  }
  // for conformation Delete()
  deleteMasterEntity() {
    this.showDeleteConfirmationDialog = false;
    if (this.deletedItemType == 'rack') {
      this.deleteColdStoreShelf();
    } else if (this.deletedItemType == 'room') {
      this.deleteRoom();
    } else if (
      this.deletedItemType == 'eggType' ||
      this.deletedItemType == 'potatoType'
    ) {
      this.deleteType();
    } else if (
      this.deletedItemType == 'eggUnit' ||
      this.deletedItemType == 'potatoUnit'
    ) {
      this.deleteUnit();
    } else if (
      this.deletedItemType == 'eggVariety' ||
      this.deletedItemType == 'potatoVariety'
    ) {
      this.deleteVariety();
    } else {
      this.deleteEmployee();
    }
  }
  deleteMasterEntityCancelled() {
    this.showDeleteConfirmationDialog = false;
  }

  //for open archive conformation popup
  openConfirmationDialog(isArchive: boolean) {
    if (isArchive == true) {
      this.archivedStatus = false;
      this.confirmationMessage =
        'Are you sure you want to unarchive this cold store shelf?';
    } else {
      this.archivedStatus = true;
      this.confirmationMessage =
        'Are you sure you want to archive this cold store shelf?';
    }
    this.showConfirmDialog = true;
  }

  handleCancelled() {
    this.showConfirmDialog = false;
    this.showConfirmationDialog = false;
  }
  handleRoomCancelled() {
    this.roomConfirmDialog = false;
  }
  // for room popup
  openRoomConfirmationDialog(isArchive: boolean) {
    if (isArchive == true) {
      this.archivedStatus = false;
      this.roomConfirmMessage = 'Are you sure you want to unarchive this room?';
    } else {
      this.archivedStatus = true;
      this.roomConfirmMessage = 'Are you sure you want to archive room?';
    }
    this.roomConfirmDialog = true;
  }

  // edit room archive status
  editRoomArchiveStatus() {
    this.roomConfirmDialog = false;
    this.coldStoreService
      .updateRoomArchiveStatus(this.roomId, this.archivedStatus)
      .subscribe(
        (dt) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Update',
            detail: 'Room change archived successfully',
            life: 3000,
          });
          this.getRoomList();
        },
        (error) => {
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
  openEggPopup() {
    this.addTypeVarietyUnitModel.patchValue({ productTypeId: 1 });
    this.dialogHeader = 'Add Egg Type';
    this.popupLabelTitle = 'Name';
    this.popupPlaceholder = 'Enter type name...';
    this.inputType = 'text';
    this.popupType = 'type';
    this.isAddTypeVarietyUnit = true;
  }
  openPotatoPopup() {
    this.addTypeVarietyUnitModel.patchValue({ productTypeId: 0 });
    this.dialogHeader = 'Add Potato Type';
    this.popupLabelTitle = 'Name';
    this.popupPlaceholder = 'Enter type name...';
    this.inputType = 'text';
    this.popupType = 'type';
    this.isAddTypeVarietyUnit = true;
  }
  openEggUnitPopup() {
    this.addTypeVarietyUnitModel.patchValue({ productTypeId: 1 });
    this.dialogHeader = 'Add Egg Unit';
    this.popupLabelTitle = 'Unit In Gram';
    this.popupPlaceholder = 'Enter unit in gram...';
    this.inputType = 'number';
    this.popupType = 'unit';
    this.isAddTypeVarietyUnit = true;
  }
  openPotatoUnitPopup() {
    this.addTypeVarietyUnitModel.patchValue({ productTypeId: 0 });
    this.dialogHeader = 'Add Potato Unit';
    this.popupLabelTitle = 'Unit In kgs';
    this.popupPlaceholder = 'Enter unit in kgs...';
    this.inputType = 'number';
    this.popupType = 'unit';
    this.isAddTypeVarietyUnit = true;
  }
  openEggVarietyPopup() {
    this.addTypeVarietyUnitModel.patchValue({ productTypeId: 1 });
    this.dialogHeader = 'Add Egg Variety';
    this.popupLabelTitle = 'Name';
    this.popupPlaceholder = 'Enter variety name...';
    this.inputType = 'text';
    this.popupType = 'variety';
    this.isAddTypeVarietyUnit = true;
  }
  openPotatoVarietyPopup() {
    this.addTypeVarietyUnitModel.patchValue({ productTypeId: 0 });
    this.dialogHeader = 'Add Potato Variety';
    this.popupLabelTitle = 'Name';
    this.popupPlaceholder = 'Enter variety name...';
    this.inputType = 'text';
    this.popupType = 'variety';
    this.isAddTypeVarietyUnit = true;
  }
  openEmployeePopup() {
    this.addTypeVarietyUnitModel.patchValue({ productTypeId: 0 });
    this.dialogHeader = 'Add Employee Type';
    this.popupLabelTitle = 'Name';
    this.popupPlaceholder = 'Enter employee type...';
    this.inputType = 'text';
    this.popupType = 'employee';
    this.isAddTypeVarietyUnit = true;
  }
  // add category type
  openCategoryPopup() {
    this.addTypeVarietyUnitModel.patchValue({ productTypeId: 0 });
    this.dialogHeader = 'Add Category Type';
    this.popupLabelTitle = 'Name';
    this.popupPlaceholder = 'Enter category type...';
    this.inputType = 'text';
    this.popupType = 'category';
    this.isAddTypeVarietyUnit = true;
  }
  // edit egg type
  openEditEggTypePopup(idValue: any) {
    this.getTypeDetails(idValue);
    this.dialogHeader = 'Edit Egg Type';
    this.popupLabelTitle = 'Name';
    this.popupPlaceholder = 'Enter type name...';
    this.inputType = 'text';
    this.popupType = 'editType';
    this.isEditTypeVarietyUnitPopup = true;
  }
  // edit potato type
  openEditPotatoTypePopup(idValue: any) {
    this.getTypeDetails(idValue);
    this.dialogHeader = 'Edit Potato Type';
    this.popupLabelTitle = 'Name';
    this.popupPlaceholder = 'Enter type name...';
    this.inputType = 'text';
    this.popupType = 'editType';
    this.isEditTypeVarietyUnitPopup = true;
  }
  // edit egg unit
  openEditEggUnitPopup(idValue: any) {
    this.getUnitDetails(idValue);
    this.dialogHeader = 'Edit Egg Unit';
    this.popupLabelTitle = 'Unit In Gram';
    this.popupPlaceholder = 'Enter unit in gram...';
    this.inputType = 'number';
    this.popupType = 'editUnit';
    this.isEditTypeVarietyUnitPopup = true;
  }
  // edit potato unit
  openEditPotatoUnitPopup(idValue: any) {
    this.getUnitDetails(idValue);
    this.dialogHeader = 'Edit Potato Unit';
    this.popupLabelTitle = 'Unit In kgs';
    this.popupPlaceholder = 'Enter unit in kgs...';
    this.inputType = 'number';
    this.popupType = 'editUnit';
    this.isEditTypeVarietyUnitPopup = true;
  }
  openEditEggVarietyPopup(idValue: any) {
    this.getVarietyDetails(idValue);
    this.dialogHeader = 'Edit Egg Variety';
    this.popupLabelTitle = 'Name';
    this.popupPlaceholder = 'Enter variety name...';
    this.inputType = 'text';
    this.popupType = 'editVariety';
    this.isEditTypeVarietyUnitPopup = true;
  }
  openEditPotatoVarietyPopup(idValue: any) {
    this.getVarietyDetails(idValue);
    this.dialogHeader = 'Edit Potato Variety';
    this.popupLabelTitle = 'Name';
    this.popupPlaceholder = 'Enter variety name...';
    this.inputType = 'text';
    this.popupType = 'editVariety';
    this.isEditTypeVarietyUnitPopup = true;
  }
  openEditEmployeePopup(idValue: any) {
    this.getEmployeeDetails(idValue);
    this.dialogHeader = 'Edit Employee Type';
    this.popupLabelTitle = 'Name';
    this.popupPlaceholder = 'Enter employee type...';
    this.inputType = 'text';
    this.popupType = 'editEmployee';
    this.isEditTypeVarietyUnitPopup = true;
  }
  // delete cold store
  deleteColdStoreShelf() {
    this.showConfirmationDialog = false;
    this.coldStoreService.DeleteColdStoreShelf(this.deletedItemId).subscribe(
      (data) => {
        this.getColdStoreShelfList();
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Rack deleted successfully',
          life: 3000,
        });
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
          life: 3000,
        });
      }
    );
  }

  // delete room
  deleteRoom() {
    this.showConfirmationDialog = false;
    this.coldStoreService.DeleteRoom(this.deletedItemId).subscribe(
      (data) => {
        this.getRoomList();
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Room deleted successfully',
          life: 3000,
        });
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
          life: 3000,
        });
      }
    );
  }
  // delete Types
  deleteType() {
    this.showConfirmationDialog = false;
    this.coldStoreService.DeleteType(this.deletedItemId).subscribe(
      (data) => {
        if (this.deletedItemType == 'eggType') {
          this.getEggTypes();
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Egg type deleted successfully',
            life: 3000,
          });
        } else {
          this.getPotatoTypes();
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Potato type deleted successfully',
            life: 3000,
          });
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
          life: 3000,
        });
      }
    );
  }
  // delete Units
  deleteUnit() {
    this.showConfirmationDialog = false;
    this.coldStoreService.DeleteUnit(this.deletedItemId).subscribe(
      (data) => {
        if (this.deletedItemType == 'eggUnit') {
          this.getEggUnit();
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Egg unit deleted successfully',
            life: 3000,
          });
        } else {
          this.getPotatoUnits();
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Potato unit deleted successfully',
            life: 3000,
          });
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
          life: 3000,
        });
      }
    );
  }
  // delete Variety
  deleteVariety() {
    this.showConfirmationDialog = false;
    this.coldStoreService.DeleteVariety(this.deletedItemId).subscribe(
      (data) => {
        if (this.deletedItemType == 'eggVariety') {
          this.getEggVariety();
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Egg variety deleted successfully',
            life: 3000,
          });
        } else {
          this.getPotatoVariety();
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Potato variety deleted successfully',
            life: 3000,
          });
        }
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
          life: 3000,
        });
      }
    );
  }
  // delete Employee
  deleteEmployee() {
    this.showConfirmationDialog = false;
    this.coldStoreService.DeleteEmployee(this.deletedItemId).subscribe(
      (data) => {
        this.getEmployeeTypes();
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Employee type deleted successfully',
          life: 3000,
        });
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
          life: 3000,
        });
      }
    );
  }
  loadProducts() {
    this.masterService.getProducts().subscribe(
      (res) => {
        var dt = res.data;
        this.products = [];
        this.productsDataSource = new MatTableDataSource(this.products);
        for (let a = 0; a < dt.length; a++) {
          let _data: masterModal = {
            id: dt[a].productId,
            type: dt[a].name,
          };
          this.products.push(_data);
        }
        this.productsDataSource = new MatTableDataSource(this.products);
      },
      (error) => {
        if (error.status == 401) {
          this.accountService.doLogout();
        }
      }
    );
  }
  addProduct() {
    this.addLoading = true;
    let data = {
      name: this.addProductModel.value.value,
    };
    this.coldStoreService.AddProduct(data).subscribe(
      (dt) => {
        this.addLoading = false;
        this.loadProducts();
        this.isAddTypeVarietyUnit = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Product added successfully',
          life: 3000,
        });
      },
      (error) => {
        this.addLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 3000,
        });
        if (error.status == 401) {
          this.accountService.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }
  // addProduct() {
  //   this.addLoading = true;
  //   let data = {
  //     businessUnitId: this._businessUnitId,
  //   };
  //   this.coldStoreService.AddProduct(this.addProductModel.value).subscribe(
  //     // (dt) => {
  //     //   if (dt.productTypeId == 1) {
  //     //     this.getEggTypes();
  //     //   } else {
  //     //     this.getPotatoTypes();
  //     //   }
  //     //   this.addLoading = false;
  //     //   this.isAddProduct = false;
  //     //   this.messageService.add({
  //     //     severity: 'success',
  //     //     summary: 'Added',
  //     //     detail: 'Product added successfully',
  //     //     life: 3000,
  //     //   });
  //     // },
  //     (error) => {
  //       this.addLoading = false;
  //       this.loadProducts();
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: error.message,
  //         life: 3000,
  //       });
  //       if (error.status == 401) {
  //         this.accountService.doLogout();
  //         this.router.navigateByUrl('/');
  //       }
  //     }
  //   );
  // }
  openProductPopup() {
    // this.addProductModel.patchValue({ productTypeId: 0 });
    this.dialogHeader = 'Add Product';
    this.popupLabelTitle = 'Name';
    this.popupPlaceholder = 'Enter product...';
    this.inputType = 'text';
    this.popupType = 'product';
    this.isAddProduct = true;
  }
}
