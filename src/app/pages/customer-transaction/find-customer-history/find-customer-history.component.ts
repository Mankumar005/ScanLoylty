import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { ScaningService } from '../../../shared/component-services/scan.service';
import { UtilService } from '../../../shared/common-service/util.service';
import { NbToastrService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { CustomerTranstionHistoryService } from '../../../shared/component-services/customer-transaction-history';
import * as moment from 'moment';
import { CompanyRenderComponent } from '../render-component/company-view-button';
import { BranchRenderComponent } from '../render-component/branch-view-button';
import { CycleRenderComponent } from '../render-component/cycle-view';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'ngx-find-customer-history',
  templateUrl: './find-customer-history.component.html',
  styleUrls: ['./find-customer-history.component.scss']
})
export class FindCustomerHistoryComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];

  public companyList: Array<any> = [];
  public branchList: Array<any> = [];
  public cycleList: Array<any> = [];
  public stampList: Array<any> = [];
  public payloadObj: any = {};
  public userDetails: any = {};

  public isLoading: boolean = false;
  public isTokenSuccess: boolean = false;
  public isCompanyView: boolean = false;
  public isBranchView: boolean = false;
  public isCycleView: boolean = false;
  public isStampView: boolean = false;

  public customerId: any = null;
  public companyId: any = null;
  public cycleId: any = null;
  public userRole: any = null;

  public compnaySource: LocalDataSource = new LocalDataSource();
  public branchSource: LocalDataSource = new LocalDataSource();
  public cycleSource: LocalDataSource = new LocalDataSource();
  public stampCycleSource: LocalDataSource = new LocalDataSource();
  public pageSize: number = 10;
  public currentPage: number = 1;
  public showPerPage: number = 9;
  public totalCount: any;

  //company-list//
  company_settings = {
    mode: 'external',
    actions: false,
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
          const pager = this.compnaySource.getPaging();
          const ret = (pager.page - 1) * pager.perPage + cell.row.index + 1;
          return ret;
        }
      },
      company_Name: {
        title: 'Company',
        type: 'string',
      },
      email: {
        title: 'Email',
        type: 'string',
      },
      phone: {
        title: 'Phone',
        type: 'string',
      },
      company_address: {
        title: 'Address',
        type: 'string',
      },
      created_at: {
        title: 'Date',
        type: 'string',
        filter: false,
        sort: false,
      },
      action: {
        title: 'Action',
        type: 'custom',
        filter: false,
        sort: false,
        position: 'right',
        renderComponent: CompanyRenderComponent
      }
    },
  };
  //branch-list//
  branch_settings = {
    mode: 'external',
    actions: false,
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
          const pager = this.branchSource.getPaging();
          const ret = (pager.page - 1) * pager.perPage + cell.row.index + 1;
          return ret;
        }
      },
      branch_name: {
        title: 'Branch',
        type: 'string',
      },
      email: {
        title: 'Email',
        type: 'string',
      },
      phone: {
        title: 'Phone',
        type: 'string',
      },
      branch_address: {
        title: 'Address',
        type: 'string',
      },
      created_at: {
        title: 'Date',
        type: 'string',
        filter: false,
        sort: false,
      },
      action: {
        title: 'Action',
        type: 'custom',
        filter: false,
        sort: false,
        position: 'right',
        renderComponent: BranchRenderComponent
      }
    }
  };
  //cycle-list//
  cycle_settings = {
    mode: 'external',
    actions: false,
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
          const pager = this.cycleSource.getPaging();
          const ret = (pager.page - 1) * pager.perPage + cell.row.index + 1;
          return ret;
        }
      },
      customer_cycle_id: {
        title: 'Cycle No',
        type: 'string',
      },
      stamp_cycle_name: {
        title: 'Stamp Cycle Name',
        type: 'string',
      },
      created_at: {
        title: 'Date',
        type: 'number',
        filter: false,
        sort: false,
      },
      action: {
        title: 'Action',
        type: 'custom',
        filter: false,
        sort: false,
        position: 'right',
        renderComponent: CycleRenderComponent
      }
    },
  };
  //stamp-list//
  stamp_settings = {
    mode: 'external',
    actions: false,
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
          const pager = this.stampCycleSource.getPaging();
          const ret = (pager.page - 1) * pager.perPage + cell.row.index + 1;
          return ret;
        }
      },
      customer_cycle_id: {
        title: 'Cycle No',
        type: 'string',
      },
      sequence_no: {
        title: 'Sequence No',
        type: 'number',
        filter: false,
        sort: false,
      },
      stamp_scan_token: {
        title: 'Token',
        type: 'string',
      },
      offer_description: {
        title: 'Offer',
        type: 'number',
        filter: false,
        sort: false,
      },
      created_at: {
        title: 'Date',
        type: 'number',
        filter: false,
        sort: false,
      }
    },
  };

  public formValidations: any = {
    customer_unique_id: [{ type: 'required', message: 'Customer Id is required' }],
    company_id: [{ type: 'required', message: 'Company is required' }],
    branch_id: [{ type: 'required', message: 'Branch is required' }],

  }
  customerTransactionForm = this.fb.group({
    customer_unique_id: new FormControl(''),
  })

  findTransationForm = this.fb.group({
    company_id: new FormControl(),
    branch_id: new FormControl(),
    cycle_id: new FormControl(),
  })

  constructor(
    public fb: FormBuilder,
    public jwtHelper: JwtHelperService,
    public customerTransactionService: CustomerTranstionHistoryService,
    public utilService: UtilService,
    private toastrService: NbToastrService,
  ) {

  }
  ngOnInit(): void {
    this.userRole = this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
    this.userDetails = this.utilService.getLocalStorageValue('userDetail')
    // this.getCompanyList()
    this.isCompanyView = false;
    this.isBranchView = false;
    this.isCycleView = false;
    this.isStampView = false;
    if (this.userRole.role === 'SUPERADMIN') {
      this.findTransationForm.get('company_id')?.setValue(this.userDetails?.company_id)
      // this.findTransationForm.get('company_id')?.disable()
      this.isStampView = false;
    }
    if (this.userRole.role === 'COMPANY') {
      this.findTransationForm.get('company_id')?.setValue(this.userDetails?.company_id)
      this.findTransationForm.get('company_id')?.disable()
      this.isStampView = false;
    }
    if (this.userRole.role === 'BRANCH_EXECUTIVE') {
      this.findTransationForm.get('company_id')?.setValue(this.userDetails?.company_id)
      this.findTransationForm.get('branch_id')?.setValue(this.userDetails?.branch_id)
      this.findTransationForm.get('company_id')?.disable()
      this.findTransationForm.get('branch_id')?.disable()
      this.isStampView = false;
    }
    if (this.userRole.role === 'BRANCH') {
      this.findTransationForm.get('company_id')?.setValue(this.userDetails?.company_id)
      this.findTransationForm.get('branch_id')?.setValue(this.userDetails?.branch_id)
      this.findTransationForm.get('company_id')?.disable()
      this.findTransationForm.get('branch_id')?.disable()
      this.isStampView = false;
    }
  }

  public getCompnayId(event: any) {
    this.findTransationForm.get('branch_id')?.setValue(null)
    this.findTransationForm.get('cycle_id')?.setValue(null)
    this.payloadObj.company_id = event.id;
    this.getBranchList(event.id)
  }
  public getBranchId(event: any) {
    this.isStampView = false;
    this.findTransationForm.get('cycle_id')?.setValue(null)
    this.payloadObj.branch_id = event.id;
    if (this.userRole.role !== 'SUPERADMIN') {
      this.payloadObj.company_id = this.userDetails?.company_id
    } else {
      this.payloadObj.company_id = this.findTransationForm.get('company_id')?.value;
    }
    this.getCycleList()
  }
  public getCycleId(event: any) {
    if (this.userRole.role !== 'SUPERADMIN') {
      this.payloadObj.company_id = this.userDetails?.company_id
    } else {
      this.payloadObj.company_id = this.findTransationForm.get('company_id')?.value;
    }
    this.payloadObj.customer_cycle_id = event.customer_cycle_id
    this.getStampCycleList()
  }
  public getCompanyList() {
    let payloadObj: any = {};
    payloadObj.customer_unique_id = '';
    this.subscription.push(this.customerTransactionService.getCompanyData(payloadObj.customer_unique_id).subscribe((res: any) => {
      this.companyList = res.data;
      this.branchSource.load(this.branchList);
    }, error => {
      this.isLoading = false;
      if (error && error.error.errors && error.error.errors.failed) {
        // this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public getBranchList(company_id: any) {
    let payloadObj: any = {};
    payloadObj.customer_unique_id = this.payloadObj.customer_unique_id;
    payloadObj.company_id = company_id;
    this.subscription.push(this.customerTransactionService.getBranchData(payloadObj).subscribe((res: any) => {
      this.isLoading = false;
      this.isBranchView = true;
      this.branchList = res.data;
      this.branchList.forEach((el: any) => {
        el.branch_Name = el.branch_name
        el.created_at = moment.utc(el.created_at).local().format("DD-MM-YYYY hh:mm A");
      })
      this.branchSource.load(this.branchList);
      this.getCycleList()
    }, error => {
      this.isLoading = false;
      if (error && error.error.errors && error.error.errors.failed) {
        // this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public getCycleList() {
    let payloadObj: any = {};
    payloadObj.customer_unique_id = this.payloadObj.customer_unique_id;
    payloadObj.company_id = this.payloadObj.company_id;
    payloadObj.branch_id = this.findTransationForm?.get('branch_id')?.value;
    this.subscription.push(this.customerTransactionService.getCycleData(payloadObj).subscribe((res: any) => {
      this.isLoading = false;
      this.isCycleView = true;
      this.cycleList = res.data;
      this.cycleList.forEach((element: any) => {
        element.stamp_cycle_name = 'Cycle ' + element?.customer_cycle_id + ' - ' + element?.stamp_cycle?.stamp_cycle_name
        element.created_at = moment.utc(element.created_at).local().format("DD-MM-YYYY hh:mm A");
      })
      this.cycleSource.load(this.cycleList);
    }, error => {
      this.isLoading = false;
      if (error && error.error.errors && error.error.errors.failed) {
        // this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public getStampCycleList() {
    let payloadObj: any = {};
    payloadObj.customer_unique_id = this.payloadObj.customer_unique_id;
    payloadObj.company_id = this.payloadObj.company_id;
    payloadObj.branch_id = this.findTransationForm?.get('branch_id')?.value;
    payloadObj.customer_cycle_id = this.payloadObj.customer_cycle_id;
    this.subscription.push(this.customerTransactionService.getStempData(payloadObj).subscribe((res: any) => {
      this.isLoading = false;
      this.isStampView = true;
      this.stampList = res.data;
      this.stampList.forEach((el: any) => {
        el.created_at = moment.utc(el.created_at).local().format("DD-MM-YYYY hh:mm A");
      })
      this.stampCycleSource.load(this.stampList);
    }, error => {
      this.isLoading = false;
      if (error && error.error.errors && error.error.errors.failed) {
        // this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public onSubmit() {
    this.isLoading = true;
    this.customerTransactionForm.markAllAsTouched();
    if (this.customerTransactionForm.invalid) {
      this.isLoading = false;
      this.isCompanyView = false;
      return;
    }
    this.findTransationForm.get('branch_id')?.setValue(null)
    this.findTransationForm.get('cycle_id')?.setValue(null)
    this.isCompanyView = false;
    this.isBranchView = false;
    this.isCycleView = false;
    this.isStampView = false;
    let payloadObj: any = {};
    payloadObj = Object.assign(this.customerTransactionForm.value);
    this.payloadObj.customer_unique_id = payloadObj.customer_unique_id;
    this.payloadObj.company_id = this.findTransationForm?.get('company_id')?.value;
    this.payloadObj.branch_id = this.findTransationForm?.get('branch_id')?.value;
    // console.log(payloadObj, 'payloadObj-----');
    // console.log( this.payloadObj, ' this.payloadObj-----');
    this.subscription.push(this.customerTransactionService.getCompanyData(payloadObj.customer_unique_id).subscribe((res: any) => {
      this.isLoading = false;
      this.isCompanyView = true;
      this.companyList = res.data;
      this.getBranchList(this.userDetails?.company_id)
      if (this.userRole.role === 'BRANCH_EXECUTIVE') {
        this.findTransationForm.get('branch_id')?.setValue(this.userDetails?.branch_id)
        this.isBranchView = true;
        this.isCycleView = true;
        this.isStampView = false;
      }
      if (this.userRole.role === 'BRANCH') {
        this.findTransationForm.get('branch_id')?.setValue(this.userDetails?.branch_id)
        this.isBranchView = true;
        this.isCycleView = true;
        this.isStampView = false;
      }
      this.compnaySource.load(this.companyList);
      this.toastrService.success(res.message, 'Success')
    }, error => {
      this.isLoading = false;
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public newSearch() {
    this.isLoading = false;
    this.isCompanyView = false;
    this.isBranchView = false;
    this.isCycleView = false;
    this.isStampView = false;
    if (this.userRole.role === 'SUPERADMIN') {
      this.findTransationForm.get('company_id')?.setValue(null)
    }
    this.findTransationForm.get('branch_id')?.setValue(null)
    this.findTransationForm.get('cycle_id')?.setValue(null)
    this.companyList = [];
    this.compnaySource.load([]);
    this.branchSource.load([]);
    this.cycleSource.load([]);
    this.stampCycleSource.load([]);
    this.customerTransactionForm.reset();
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }
}
