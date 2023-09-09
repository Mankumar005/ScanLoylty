import { Component, OnDestroy, OnInit } from '@angular/core';
import { UtilService } from '../../shared/common-service/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { CommonService } from '../../shared/common-service/common.service';

@Component({
  selector: 'ngx-common-company-branch',
  templateUrl: './common-company-branch.component.html',
  styleUrls: ['./common-company-branch.component.scss']
})
export class CommonCompanyBranchComponent implements OnInit,OnDestroy {
  public subscription: Subscription[] = [];
  public customerCompanylist: Array<any> = [];
  public customerBranchlist: Array<any> = [];

  public companyId:any = null;
  public branchId:any= null;
  public userDetails:any = null;
  public selectBranchValue: any = "";

  constructor(
    public utilService: UtilService,
    public commonService: CommonService,
    public router: Router,
    public route: ActivatedRoute,
    private toastrService: NbToastrService,
  ) { 
    this.userDetails = this.utilService.getLocalStorageValue('userDetail')
  }

  ngOnInit(): void {
    this.getCustomerCompanylist()
    this.getCustomerBranchlist()
  }

  public getCustomerCompanylist() {
    this.subscription.push(this.commonService.getAllCompanys().subscribe(
      (res: any) => {
        this.customerCompanylist = res.data;
      },
      (error) => {
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], "Error");
        }
      }
    ));
  }

  public getCustomerBranchlist() {
    let payloadObj:any = {};
    payloadObj.company_id = this.companyId
    payloadObj.customer_id = this.userDetails.id
    this.subscription.push(this.commonService.getBranchByID(payloadObj).subscribe(
      (res: any) => {
        this.customerBranchlist = res.data;
      },
      (error) => {
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], "Error");
        }
      }
    ));
  }
  public getSelectedCompanyId(company_id: any) {
 
  }
  public getSelectedBranchId(branch_id: any) {
    this.branchId = branch_id;
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }
}
