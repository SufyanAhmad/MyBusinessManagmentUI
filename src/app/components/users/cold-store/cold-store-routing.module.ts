import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColdStoreComponent } from './cold-store.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StocksComponent } from './stocks/stocks.component';
import { ColdStoreShelfComponent } from './cold-store-shelf/cold-store-shelf.component';
import { EditColdStoreShelfComponent } from './cold-store-shelf/edit-cold-store-shelf/edit-cold-store-shelf.component';
import { CustomersComponent } from './customers/customers.component';
import { VouchersComponent } from './vouchers/vouchers.component';
import { EditStocksComponent } from './stocks/edit-stocks/edit-stocks.component';
import { StockInComponent } from './stocks/stock-in/stock-in.component';
import { StockOutComponent } from './stocks/stock-out/stock-out.component';
import { CustomerPaymentComponent } from './customer-payment/customer-payment.component';
import { EditCustomersComponent } from './customers/edit-customers/edit-customers.component';
import { CustomerPaymentDetailComponent } from './customer-payment/customer-payment-detail/customer-payment-detail.component';
import { EditStockOutComponent } from './stocks/stock-out/edit-stock-out/edit-stock-out.component';
const routes: Routes = [
  {
    path: '',
    component: ColdStoreComponent,
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
      // {
      //    path: 'stocks',
      //   component:StocksComponent ,
      // },
      {
        path: 'stock-in',
        component: StocksComponent,
      },
      {
        path: 'stock-out',
        component: StockOutComponent,
      },
      {
        path: 'stock-out/:id',
        component: EditStockOutComponent,
      },
      {
        path: 'stock-out/:type/:id',
        component: StockOutComponent,
      },
      {
        path: 'stock-in/detail/:id',
        component: StocksComponent,
      },
      {
        path: 'stock-in/:id',
        component: EditStocksComponent,
      },
      {
        path: 'cold-store-shelf',
        component: ColdStoreShelfComponent,
      },
      {
        path: 'cold-store-shelf/edit/:id',
        component: EditColdStoreShelfComponent,
      },
      {
        path: 'customers/edit/:id',
        component: EditCustomersComponent,
      },
      {
        path: 'customers',
        component: CustomersComponent,
      },
      {
        path: 'customers',
        component: CustomersComponent,
      },
      {
        path: 'customer-payment',
        component: CustomerPaymentComponent,
      },
      {
        path: 'vouchers',
        component: VouchersComponent,
      },
      {
        path: 'customers-detail/edit/:id',
        component: CustomerPaymentDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColdStoreRoutingModule {}
