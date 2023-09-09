import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbComponentStatus, NbPosition, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { Router } from '@angular/router';
import { CustomerService } from '../../../shared/component-services/customer.service';
import { CustomerRenderComponent } from '../render-component/customer-edit-view-button';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../shared/common-service/common.service';
import { UtilService } from '../../../shared/common-service/util.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';

@Component({
  selector: 'ngx-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];
  public customerList: Array <any> = [];
  public companyList: Array <any> = [];
  
  public userDetails:any = null;
  public userRole:any = null;

  public isLoading: boolean = false;
  public source: LocalDataSource = new LocalDataSource();
  public pageSize = 10;
  public currentPage = 1;
  public showPerPage = 9;
  public totalCount:any;
   
    settings = {
      actions: false,
      mode: 'external', 
      pager:{
        display: true,
        perPage: this.showPerPage,
      },
       columns: {
        index:{
          title: 'No',
          type: 'string',
          filter:false,
          sort: false,
          valuePrepareFunction : (val,row,cell)=>{
            const pager = this.source.getPaging();
            const ret = (pager.page-1) * pager.perPage + cell.row.index+1;
            return ret;
         }
        },
        name: {
          title: 'Name',
          type: 'string',
        },
        email: {
          title: 'E-mail',
          type: 'string',
        },
        phone: {
          title: 'Phone',
          type: 'string',
        },
        date_of_birth: {
          title: 'Date Of Birth',
          type: 'string',
          filter:false,
          sort:false,
        },
        action:{
          title: 'Action',
          type: 'custom',
          filter:false,
          sort: false,
          position: 'right',
          renderComponent: CustomerRenderComponent
        }
      },
    };
  
    constructor(public service: SmartTableData,
                public customerService: CustomerService,
                public utilService:UtilService,
                public jwtHelper: JwtHelperService,
                public commonService: CommonService,
                public router : Router,
                private toastrService: NbToastrService)
                 {
                  this.userRole = this.jwtHelper.decodeToken(localStorage.getItem('access_token')); 
                  this.userDetails = this.utilService.getLocalStorageValue('userDetail');
                 }
   
    ngOnInit(): void {
      this.getCustomerList('')
      this.getCompanyList()
    }
  public getCompnayId(event:any){
      this.getCustomerList(event.id)
  }
  public getCompanyList(){
      this.subscription.push(this.commonService.getAllCompanys().subscribe((res: any) => {
        this.companyList = res.data
      }, error => {
        this.isLoading = false;
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], 'Error');
        }
      }))
  }
  public getCustomerList(company_id:any){
      this.isLoading = true;
      let payloadObj:any = {};
      payloadObj.company_id = this.userDetails.company_id ? this.userDetails.company_id : company_id ;
      this.subscription.push(this.customerService.getCustomerList(payloadObj.company_id).subscribe((res:any)=>{
          this.customerList = res.data
          this.customerList.forEach((el: any) => {
            el.date_of_birth = el.date_of_birth ? moment.utc(el.date_of_birth).local().format('DD-MM-YYYY') : '';
          })
          this.isLoading = false;
           this.source.load(this.customerList);
           this.totalCount = res.with.total
      },error => {
        this.isLoading = false;
        if(error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0],'Error');
        }
      }))
  }
  
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
} 
}
