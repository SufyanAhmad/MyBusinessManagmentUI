import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StorageUnitComponent } from './storage-unit.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InventoryItemsComponent } from './inventory-items/inventory-items.component';
import { SalesComponent } from './sales/sales.component';
import { StorageUnitCustomersComponent } from './storage-unit-customers/storage-unit-customers.component';
import { StorageUnitSuppliersComponent } from './storage-unit-suppliers/storage-unit-suppliers.component';
import { EditStorageUnitCustomersComponent } from './storage-unit-customers/edit-storage-unit-customers/edit-storage-unit-customers.component';
import { EditInventoryItemsComponent } from './inventory-items/edit-inventory-items/edit-inventory-items.component';
import { EditStorageUnitSuppliersComponent } from './storage-unit-suppliers/edit-storage-unit-suppliers/edit-storage-unit-suppliers.component';
import { StorageUnitLedgersComponent } from './storage-unit-ledgers/storage-unit-ledgers.component';
import { EditStorageUnitLedgersComponent } from './storage-unit-ledgers/edit-storage-unit-ledgers/edit-storage-unit-ledgers.component';
import { EditSalesComponent } from './sales/edit-sales/edit-sales.component';
const routes: Routes = [
  {
    path: '',
    component: StorageUnitComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'inventory-items',
        component: InventoryItemsComponent,
      },
      {
        path: 'inventory-items/:id',
        component: EditInventoryItemsComponent,
      },
      {
        path: 'sales',
        component: SalesComponent,
      },
      {
        path: 'sales/:id',
        component: EditSalesComponent,
      },
      {
        path: 'customers',
        component: StorageUnitCustomersComponent,
      },
      {
        path: 'customers/edit/:id',
        component: EditStorageUnitCustomersComponent,
      },
      {
        path: 'suppliers',
        component: StorageUnitSuppliersComponent,
      },
      {
        path: 'suppliers/edit/:id',
        component: EditStorageUnitSuppliersComponent,
      },
      {
        path: 'ledger-transactions',
        component: StorageUnitLedgersComponent,
      },
      {
        path: 'ledger-transactions/edit/:id',
        component: EditStorageUnitLedgersComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorageUnitRoutingModule {}
