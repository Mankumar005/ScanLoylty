import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { CustomerService } from '../../../shared/component-services/customer.service';
import { Router } from '@angular/router';
import { PaginationService } from '../../../shared/component-services/pagination-service';
import * as moment from 'moment';
import { TransactionService } from '../../../shared/component-services/transaction.service';
import { Subscription } from 'rxjs';
import { UtilService } from '../../../shared/common-service/util.service';
import { CommonService } from '../../../shared/common-service/common.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'ngx-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];
    
  @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;
 
  public customerTransactionHistoryList: Array<any> = [];
  public companyList: Array<any> = [];
  public branchList: Array<any> = [];
  public customerList: Array<any> = []
  public status: NbComponentStatus[] = ['primary'];

  public isLoading: boolean = false;
  public isBranchView: boolean = false;
  public ngSelectedValue:any
  public customerId: any = '';
  public companyId: any = '';
  public branchId: any = '';
  public selectBranchValue: any = ''
  public userDetails: any = null;
  public userRole: any = null;

  public source: LocalDataSource = new LocalDataSource();
  public pageSize = 10;
  public currentPage = 1;
  public showPerPage = 10;
  public totalCount: any;

  settings = {
    actions: false,
    mode: 'external',
    pager: {
      display: true,
      perPage: this.showPerPage,
    },
    columns: {
      index: {
        title: 'No',
        type: 'string',
        filter: false,
        sort: false,
        valuePrepareFunction: (val, row, cell) => {
          const pager = this.source.getPaging();
          const ret = (pager.page - 1) * pager.perPage + cell.row.index + 1;
          return ret;
        }
      },
      customer_name: {
        title: 'Customer Name',
        type: 'number',
      },
      customer_phone: {
        title: 'Phone',
        type: 'string',
      },
      company_name: {
        title: 'Company',
        type: 'string',
      },
      branch_name: {
        title: 'Branch',
        type: 'string',
      },
      customer_cycle_id: {
        title: 'Cycle No',
        type: 'string',
      },
      sequence_no: {
        title: 'Sequence No',
        type: 'number',
        // filter: false
      },
      utilized_date_time: {
        title: 'Use Date',
        type: 'number',
        filter: false,
        sort: false,
      },
    },
  };

  constructor(public service: SmartTableData,
    public customerService: CustomerService,
    public utilService: UtilService,
    public jwtHelper: JwtHelperService,
    public commonService: CommonService,
    public transactionService: TransactionService,
    public router: Router,
    private toastrService: NbToastrService,
    private clientService: PaginationService) 
    {
    this.userRole = this.jwtHelper.decodeToken(localStorage.getItem('access_token'));   
    this.userDetails = this.utilService.getLocalStorageValue('userDetail')
    if(this.userDetails.company_id == null){
      this.userDetails.company_id = '';
    }
    }

  ngOnInit(): void {
    // this.initOnChagedData();
    this.getCustomerCompanylist()
    this.getCustomerSetmHistoryList(this.userDetails.company_id)
  }
  public getCustomerCompanylist() {
    this.subscription.push(this.commonService.getAllCompanys().subscribe((res: any) => {
      this.companyList = res.data
    }, error => {
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }

  public getCustomerBranchlist() {
    let payloadObj: any = {};
    payloadObj.company_id = this.companyId
    payloadObj.customer_id = this.userDetails.id
    this.subscription.push(this.customerService.getBranchByID(payloadObj).subscribe((res: any) => {
      this.branchList = res.data
      this.isBranchView = true;
    }, error => {
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }

  public getCompanyId(event: any) {
    this.companyId = event.id
    this.selectBranchValue = '';
    this.branchId = '';
    this.ngSelectedValue = []; 
    if (!this.companyId) {
      this.selectBranchValue = '';
      this.branchId = '';
      this.getCustomerBranchlist()
    }
    this.branchList = [];
    this.getCustomerBranchlist()
    this.getCustomerSetmHistoryList('')
  }

  public getBranchId(event: any) {
    this.branchId = event.branch_id
    this.getCustomerSetmHistoryList('')
  }

  public getCustomerSetmHistoryList(company_id:any) {
    this.isLoading = true;
    let payloadObj:any = {};
    payloadObj.company_id = this.companyId ? this.companyId : company_id;
    payloadObj.branch_id = this.branchId ;
    console.log(payloadObj,'this.payloadObj=========');
    this.subscription.push(this.transactionService.getCustomeTransactionHistoryByID(payloadObj.company_id,payloadObj.branch_id).subscribe((res: any) => {
      this.customerTransactionHistoryList = res.data
      this.customerTransactionHistoryList.forEach((el: any) => {
        el.company_name = el.company?.company_name
        el.branch_name = el.branch?.branch_name
        el.customer_name = el.customer?.name
        el.customer_email = el.customer?.email
        el.customer_phone = el.customer?.phone
        el.utilized_date_time = moment.utc(el.utilized_date_time).local().format('DD-MM-YYYY hh:mm A')
      })
      this.isLoading = false;
      this.source.load(this.customerTransactionHistoryList);
      this.totalCount = res.with.total
    }, error => {
      this.isLoading = false;
      this.source.load([]);
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public onViewCustomerDetails(event: any): void {
    this.router.navigate([`/pages/customer/customer-details`], { queryParams: { customer_id: event.data.id } });
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }
}
