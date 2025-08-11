import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../../../../services/account-service/account.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ColdStoreServiceService } from '../../../../../services/cold-store-service/cold-store-service.service';
import { CustomerPaymentDetailModel } from '../../../../../models/super-admin/super-admin-model';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { SuperAdminService } from '../../../../../services/super-admin-service/super-admin.service';
@Component({
  selector: 'app-customer-payment-detail',
  imports: [
    CommonModule,
    SelectModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    SkeletonModule,
    RouterLink
  ],
  templateUrl: './customer-payment-detail.component.html',
  styleUrl: './customer-payment-detail.component.scss',
  providers: [MessageService],
})
export class CustomerPaymentDetailComponent {
  loading: boolean = false;
  paymentId: any = null;
  hasCredit: boolean = false;
  hasDebit: boolean = false;
  businessUnitName: any = '';
  
  CustomerPaymentDetail: CustomerPaymentDetailModel[] = [];

  // CustomerPaymentDetail: CustomerPaymentDetailModel = {
  //   paymentId: '',
  //   reference: '',
  //   client: '',
  //   businessUnit: '',
  //   createdBy: '',
  //   createdAt: '',
  //   voucherTypeId: '',
  //   voucherType: '',
  //   productTypeId: '',
  //   productType: '',
  //   billNo: 0,
  //   clientId: '',
  //   paymentDate: '',
  //   amount: 0,
  //   note: '',
  //   isCredit: false,
  //   businessUnitId: '',
  // };
  // constCustomerPaymentDetail: CustomerPaymentDetailModel = {
  //   paymentId: '',
  //   reference: '',
  //   client: '',
  //   businessUnit: '',
  //   createdBy: '',
  //   createdAt: '',
  //   voucherTypeId: '',
  //   voucherType: '',
  //   productTypeId: '',
  //   productType: '',
  //   billNo: 0,
  //   clientId: '',
  //   paymentDate: '',
  //   amount: 0,
  //   note: '',
  //   isCredit: false,
  //   businessUnitId: '',
  // };
  constructor(
    private route: ActivatedRoute,
    // private location: Location,
    // private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private accountService: AccountService,
    // private masterService: MasterService,
    private superAdminService: SuperAdminService,
    private coldStoreService: ColdStoreServiceService
  ) {}
  ngOnInit() {
    this.paymentId = this.route.snapshot.params['id'];
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');

    this.getCustomerDetail();
  }
  getCustomerDetail() {
    this.loading = true;

    this.superAdminService.getCustomerDetailById(this.paymentId).subscribe(
      (data: any[]) => {
        console.log('API Response:', data); // Debug check

        // ✅ First map, then sort: Credit entries first
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

        // ✅ Sort credit first
        this.CustomerPaymentDetail = mappedData.sort((a, b) => {
          return (b.isCredit ? 1 : 0) - (a.isCredit ? 1 : 0);
        });

        // ✅ No change to existing logic
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
