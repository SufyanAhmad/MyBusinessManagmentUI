import { Component } from '@angular/core';
import { ActivatedRoute, Router,RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../../../services/account-service/account.service';
import { SuperAdminService } from '../../../../services/super-admin-service/super-admin.service';
import { ColdStoreServiceService } from '../../../../services/cold-store-service/cold-store-service.service';
import { CustomerPaymentDetailModel } from '../../../../models/super-admin/super-admin-model';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-ledger-transactions-detail',
  imports: [
    CommonModule,
    SelectModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    SkeletonModule,
    RouterLink
  ],
  templateUrl: './ledger-transactions-detail.component.html',
  styleUrl: './ledger-transactions-detail.component.scss',
  providers: [MessageService],
})
export class LedgerTransactionsDetailComponent {
  loading: boolean = false;
  paymentId: any = null;
  hasCredit: boolean = false;
  hasDebit: boolean = false;
  checkRouteUrl: string = '';
  isShowLabel: boolean = false;
businessUnitName:any='';
  CustomerPaymentDetail: CustomerPaymentDetailModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private superAdminService: SuperAdminService,
        private router: Router
    
  ) {}
  ngOnInit() {
    this.paymentId = this.route.snapshot.params['id'];
    this.businessUnitName = localStorage.getItem('DF_businessUnit_Name');
    this.checkRouteUrl = this.router.url;
      if (this.checkRouteUrl.includes('/storageUnit/ledger-transactions')) {
            this.isShowLabel = true;
          }
    this.getCustomerDetail();
  }
  getCustomerDetail() {
    this.loading = true;

    this.superAdminService.getCustomerDetailById(this.paymentId).subscribe(
      (data: any[]) => {
        const mappedData = data.map((item) => ({
          paymentId: item.paymentId,
          reference: item.reference,
          client: item.client,
          businessUnit: item.businessUnit,
          createdBy: item.createdBy,
          createdAt: item.createdAt,
          voucherTypeId: item.voucherTypeId,
          voucherType: item.voucherType,
          productTypeId: item.productTypeId,
          productType: item.productType,
          billNo: item.billNo,
          clientId: item.clientId,
          paymentDate: item.paymentDate,
          amount: item.amount,
          note: item.note,
          isCredit: item.isCredit,
          businessUnitId: item.businessUnitId,
        }));

        this.CustomerPaymentDetail = mappedData.sort((a, b) => {
          return (b.isCredit ? 1 : 0) - (a.isCredit ? 1 : 0);
        });

        this.hasCredit = this.CustomerPaymentDetail.some(
          (item) => item.isCredit === true
        );
        this.hasDebit = this.CustomerPaymentDetail.some(
          (item) => item.isCredit === false
        );

        this.loading = false;
      },
      (error) => {
        console.error('Error:', error);
        this.loading = false;
      }
    );
  }
}
