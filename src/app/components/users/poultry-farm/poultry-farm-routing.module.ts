import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoultryFarmComponent } from './poultry-farm.component';
import { LiveStockComponent } from './live-stock/live-stock.component';
import { FeedStockComponent } from './feed-stock/feed-stock.component';
import { EditLiveStockComponent } from './live-stock/edit-live-stock/edit-live-stock.component';
import { VaccinationComponent } from './vaccination/vaccination.component';
import { EditVaccinationComponent } from './vaccination/edit-vaccination/edit-vaccination.component';
import { FlocksComponent } from './flocks/flocks.component';
import { EggTransferComponent } from './egg-transfer/egg-transfer.component';
import { EggProductionComponent } from './egg-production/egg-production.component';
import { FeedRecordComponent } from './feed-record/feed-record.component';
import { EditFlocksComponent } from './flocks/edit-flocks/edit-flocks.component';
import { EditFeedRecordComponent } from './feed-record/edit-feed-record/edit-feed-record.component';
import { EditEggTransferComponent } from './egg-transfer/edit-egg-transfer/edit-egg-transfer.component';
import { EditEggProductionComponent } from './egg-production/edit-egg-production/edit-egg-production.component';
import { LedgerTransactionsComponent } from './ledger-transactions/ledger-transactions.component';
import { EditLedgerTransactionsComponent } from './ledger-transactions/edit-ledger-transactions/edit-ledger-transactions.component';
import { PoultryFarmSalesComponent } from './poultry-farm-sales/poultry-farm-sales.component';
import { EditPoultryFarmSalesComponent } from './poultry-farm-sales/edit-poultry-farm-sales/edit-poultry-farm-sales.component';

const routes: Routes = [
  {
    path: '',
    component: PoultryFarmComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'dashboard',
      //   pathMatch: 'full',
      // },
      // {
      //    path: 'dashboard',
      //   component:DashboardComponent ,
      // },
      {
        path: 'live-stock',
        component: LiveStockComponent,
      },
      {
        path: 'live-stock/edit/:id',
        component: EditLiveStockComponent,
      },
      {
        path: 'feed-stock',
        component: FeedStockComponent,
      },
      {
        path: 'vaccinations',
        component: VaccinationComponent,
      },
      {
        path: 'vaccinations/:id',
        component: EditVaccinationComponent,
      },
      {
        path: 'flocks',
        component: FlocksComponent,
      },
      {
        path: 'flocks/:id',
        component: EditFlocksComponent,
      },
      {
        path: 'egg-transfers',
        component: EggTransferComponent,
      },
      {
        path: 'egg-transfers/:id',
        component: EditEggTransferComponent,
      },
      {
        path: 'egg-production',
        component: EggProductionComponent,
      },
      {
        path: 'feed-records',
        component: FeedRecordComponent,
      },
      {
        path: 'feed-records/:id',
        component: EditFeedRecordComponent,
      },
      {
        path: 'egg-production/:id',
        component: EditEggProductionComponent,
      },
      {
        path: 'ledger-transactions',
        component: LedgerTransactionsComponent,
      },
      {
        path: 'ledger-transactions/:id',
        component: EditLedgerTransactionsComponent,
      },
      {
        path: 'Poultry-farm-sales',
        component: PoultryFarmSalesComponent,
      },
      {
        path: 'Poultry-farm-sales/:id',
        component: EditPoultryFarmSalesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoultryFarmRoutingModule {}
