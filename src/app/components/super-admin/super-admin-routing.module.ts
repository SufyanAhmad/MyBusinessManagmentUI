import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminComponent } from './super-admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { EditUsersComponent } from './users/edit-users/edit-users.component';
import { BusinessUnitsComponent } from './business-units/business-units.component';
import { CustomersComponent } from './customers/customers.component';
import { EditCustomersComponent } from './customers/edit-customers/edit-customers.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { EditSuppliersComponent } from './suppliers/edit-suppliers/edit-suppliers.component';
import { LedgerTransactionsComponent } from './ledger-transactions/ledger-transactions.component';
import { EmployeesComponent } from './employees/employees.component';
import { EditEmployeesComponent } from './employees/edit-employees/edit-employees.component';
import { LedgerTransactionsDetailComponent } from './ledger-transactions/ledger-transactions-detail/ledger-transactions-detail.component';
import { BankLedgerComponent } from './bank-ledger/bank-ledger.component';
import { EditBankLedgerComponent } from './bank-ledger/edit-bank-ledger/edit-bank-ledger.component';
import { ExpansesComponent } from './expanses/expanses.component';
import { EditExpansesComponent } from './expanses/edit-expanses/edit-expanses.component';
import { SuperAdminSettingComponent } from './super-admin-setting/super-admin-setting.component';

const routes: Routes = [
  {
    path: '',
    component: SuperAdminComponent,
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
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'users/edit/:id',
        component: EditUsersComponent,
      },
      {
        path: 'business/units',
        component: BusinessUnitsComponent,
      },
      {
        path: 'ledger-transactions',
        component: LedgerTransactionsComponent,
      },
      {
        path: 'customers',
        component: CustomersComponent,
      },
      {
        path: 'customers/edit/:id',
        component: EditCustomersComponent,
      },
      {
        path: 'activity-log',
        component: ActivityLogComponent,
      },
      {
        path: 'suppliers',
        component: SuppliersComponent,
      },
      {
        path: 'suppliers/edit/:id',
        component: EditSuppliersComponent,
      },
      {
        path: 'employees',
        component: EmployeesComponent,
      },
      {
        path: 'Employee/edit/:id',
        component: EditEmployeesComponent,
      },
      {
        path: 'ledger-transactions/edit/:id',
        component: LedgerTransactionsDetailComponent,
      },
       {
        path: 'bank-ledger',
        component:BankLedgerComponent,
      },
      {
        path: 'bank-ledger/:id',
        component:EditBankLedgerComponent,
      },
      {
        path: 'expanses',
        component:ExpansesComponent,
      },
      {
        path: 'expanses/:id',
        component:EditExpansesComponent,
      },
      {
        path: 'settings',
        component:SuperAdminSettingComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminRoutingModule {}
