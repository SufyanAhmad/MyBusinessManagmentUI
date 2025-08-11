import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { Skeleton } from 'primeng/skeleton';
import { inventoryModel } from '../../../../../models/storage-unit-model/storage-unit-model';
import { AccountService } from '../../../../../services/account-service/account.service';
import { StorageUnitService } from '../../../../../services/storage-unit-service/storage-unit.service';

@Component({
  selector: 'app-edit-inventory-items',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    SelectModule,
    CheckboxModule,
    Skeleton,
  ],
  templateUrl: './edit-inventory-items.component.html',
  styleUrl: './edit-inventory-items.component.scss',
  providers: [MessageService],
})
export class EditInventoryItemsComponent {
  isReadOnly: boolean = true;
  loading: boolean = false;
  editLoading: boolean = false;
  inventoryItemId: any = null;
  busUnitId: any = null;
  businessUnitName: any = null;
  inventoryItemDetail: inventoryModel = {
    inventoryItemId: '',
    reference: '',
    typeId: 0,
    type: '',
    varietyId: 0,
    variety: '',
    quantity: 0,
    price: 0,
    supplierId: '',
    supplier: '',
    date: '',
    expiryDate: '',
    note: '',
    businessUnitId: '',
    businessUnit: '',
    tray: 0,
    crate: 0,
    isActive: false,
  };

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private storageUnitService: StorageUnitService,
    private messageService: MessageService,
    private accountService: AccountService
  ) {}
  ngOnInit() {
    this.inventoryItemId = this.route.snapshot.params['id'];
    this.busUnitId = localStorage.getItem('BS_businessUnitId');
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
    this.getStocksDetail();
  }

  getStocksDetail() {
    this.loading = true;
    this.storageUnitService.geInventoryItemById(this.inventoryItemId).subscribe(
      (dt) => {
        let data = dt;
        this.inventoryItemDetail = {
          inventoryItemId: data.inventoryItemId,
          reference: data.reference,
          typeId: data.typeId,
          type: data.type,
          varietyId: data.varietyId,
          variety: data.variety,
          quantity: data.quantity,
          price: data.price,
          supplierId: data.supplierId,
          supplier: data.supplier,
          date: data.date?.split('T')[0],
          expiryDate: data.expiryDate?.split('T')[0],
          note: data.note,
          businessUnitId: data.businessUnitId,
          businessUnit: data.businessUnit,
          isActive: data.isActive,
          tray: data.tray,
          crate: data.crate,
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
