import { Component, OnDestroy, OnInit } from "@angular/core";
import { UtilService } from "../../../shared/common-service/util.service";
import { CustomerService } from "../../../shared/component-services/customer.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { CommonService } from "../../../shared/common-service/common.service";
import * as moment from "moment";
import { Subscription } from "rxjs";

@Component({
  selector: "ngx-customer-details",
  templateUrl: "./customer-details.component.html",
  styleUrls: ["./customer-details.component.scss"],
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];
  public customerTransactionsList: Array<any> = [];
  public costomerSetmHistoryList: Array<any> = [];
  public companyList: Array<any> = [];
  public branchList: Array<any> = [];
  public cityList: Array<any> = [];

  public customerDetials: any;
  public ngSelectedValue: any
  public userDetails: any = null;

  public customerId: any = "";
  public companyId: any = "";
  public branchId: any = "";
  public selectBranchValue: any = "";

  public isLoading: boolean = false;
  public isBranchView: boolean = false;

  public source: LocalDataSource = new LocalDataSource();

  public pageSize: number = 10;
  public currentPage: number = 1;
  public showPerPage: number = 9;
  public totalCount: any;

  settings = {
    actions: false,
    mode: "external",
    pager: {
      display: true,
      perPage: this.showPerPage,
    },

    columns: {
      index: {
        title: "No",
        type: "string",
        filter: false,
        sort: false,
        valuePrepareFunction: (val, row, cell) => {
          const pager = this.source.getPaging();
          const ret = (pager.page - 1) * pager.perPage + cell.row.index + 1;
          return ret;
        },
      },
      company_name: {
        title: "Company",
        type: "string",
      },
      branch_name: {
        title: "Branch",
        type: "string",
      },
      customer_cycle_id: {
        title: "Cycle No",
        type: "string",
      },
      sequence_no: {
        title: "Sequence No",
        type: "number",
        // filter: false
      },
      utilized_date_time: {
        title: "Use Date",
        type: "number",
        filter: false,
        sort: false,
      },
    },
  };

  constructor(
    public utilService: UtilService,
    public customerService: CustomerService,
    public router: Router,
    public route: ActivatedRoute,
    public commonService: CommonService,
    private toastrService: NbToastrService,
  ) {
    this.userDetails = this.utilService.getLocalStorageValue('userDetail')
    this.route.queryParams.subscribe((params: any) => {
      this.customerId = atob(params.customer_id);
      if (this.customerId) {
        this.getCustomerData(this.customerId);
        this.getCustomerCompanylist();
      }
    });
    if(this.userDetails.company_id == null){
      this.userDetails.company_id = '';
    }
  }

  ngOnInit(): void {
    this.getCustomerCompanylist()
    this.getCustomerSetmHistoryList(this.userDetails.company_id);
    this.getCitylist();
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


  public getCustomerData(id: any) {
    this.isLoading = true;
    this.subscription.push(this.customerService.getCustomerDetailsByID(id).subscribe(
      (res: any) => {
        this.customerDetials = res.data;
        this.customerDetials.date_of_birth = moment.utc(this.customerDetials.date_of_birth).local().format('DD-MM-YYYY')
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], "Error");
        }
      }
    ));
  }

  public getCitylist() {
    this.subscription.push(this.commonService.getCityList("").subscribe(
      (res: any) => {
        this.cityList = res.data;
        this.cityList.filter((el: any) => {
          if (el.id == this.customerDetials.city_id) {
            this.customerDetials.city_name = el.city_name;
          }
        });
      },
      (error) => {
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], "Error");
        }
      }
    ));
  }

  public getCustomerSetmHistoryList(company_id: any) {
    this.isLoading = true;
    let payloadObj: any = {};
    payloadObj.company_id = this.companyId ? this.companyId : company_id;
    payloadObj.branch_id = this.branchId;
    console.log(payloadObj, 'this.payloadObj=========');
    this.subscription.push(this.customerService.getCustomeStempHistoryByID(this.customerId,payloadObj.company_id,payloadObj.branch_id).subscribe(
        (res: any) => {
          this.costomerSetmHistoryList = res.data;
          this.costomerSetmHistoryList.forEach((el: any) => {
            el.company_name = el.company?.company_name;
            el.branch_name = el.branch?.branch_name;
            el.utilized_date_time = moment.utc(el.utilized_date_time).local().format("DD-MM-YYYY hh:mm A");
          });
          this.isLoading = false;
          this.source.load(this.costomerSetmHistoryList);
          this.totalCount = res.with.total;
        },
        (error) => {
          this.isLoading = false;
          this.source.load([]);
          if (error && error.error.errors && error.error.errors.failed) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      ));
  }

  public back() {
    this.router.navigateByUrl('/pages/customer')
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }
}
