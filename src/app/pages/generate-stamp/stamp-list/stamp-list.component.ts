import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { GenerateStempRenderComponent } from '../render-component/customer-edit-view-button';
import { SmartTableData } from '../../../@core/data/smart-table';
import { Router } from '@angular/router';
import { GenerateStempService } from '../../../shared/component-services/generate-stemp.service';
import * as moment from 'moment';
import { UtilService } from '../../../shared/common-service/util.service';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'ngx-stamp-list',
  templateUrl: './stamp-list.component.html',
  styleUrls: ['./stamp-list.component.scss']
})
export class StampListComponent implements OnInit, OnDestroy {
    public subscription: Subscription[] = [];
    public stempcycleList: Array <any> = []
    public companyList: Array <any> = []

    public isLoading: boolean = false;
    public userDetails:any = null;
    public userRole:any = null;

    public source: LocalDataSource = new LocalDataSource();
    public pageSize = 10;
    public currentPage = 1;
    public showPerPage = 9;
    public totalCount:any;
    public onPermission : any = {
      access : false,
      create  :  false,
      update : false,
      view : false,
      delete : false,
    }
      settings = {
        actions: false,
        mode: 'external', 
        pager:{
          display: true,
          perPage: this.showPerPage,
        },
         columns: {
          // index:{
          //   title: 'No',
          //   type: 'string',
          //   filter:false,
          //   sort: false,
          //   valuePrepareFunction : (val,row,cell)=>{
          //     const pager = this.source.getPaging();
          //     const ret = (pager.page-1) * pager.perPage + cell.row.index+1;
          //     return ret;
          //  }
          // },
          id: {
            title: 'Stamp No',
            type: 'string',
          },
          stamp_cycle_name: {
            title: 'Stamp Cycle Name',
            type: 'string',
          },
          stamp_cycle_no: {
            title: 'No Of Stamp Cycle',
            type: 'string',
          },
          created_at: {
            title: 'Generated Date',
            type: 'string',
            filter:false,
            sort: false,
          },
          action:{
            title: 'Action',
            type: 'custom',
            filter:false,
            sort: false,
            position: 'right',
            renderComponent: GenerateStempRenderComponent
          }
        },
      };
    
      constructor(public service: SmartTableData,
                  public utilService: UtilService,
                  public jwtHelper: JwtHelperService,
                  public generateStempService: GenerateStempService,
                  public router : Router,
                  private toastrService: NbToastrService,) {
                    this.userRole = this.jwtHelper.decodeToken(localStorage.getItem('access_token')); 
                    this.userDetails = this.utilService.getLocalStorageValue('userDetail');
                    let userPermession: any = [];
                    userPermession = this.utilService.getLocalStorageValue('userDetail');
                    let permissionData = userPermession.menu_permissions.filter(function (element: any) {
                      return element.code === 'GENERATE_STAMP'});
                      permissionData[0].children_menus.forEach((menu:any)=>{
                        if(menu.code === 'STAMP_LIST'){
                          menu.permissions.filter((menu:any) =>{
                            if(menu.slug === 'VIEW'){
                            this.onPermission.view = true;
                            } 
                            if(menu.slug === 'ACCESS'){
                              this.onPermission.access = true;
                            }
                            if(menu.slug === 'CREATE'){
                              this.onPermission.create = true;
                            }
                         })
                        }
                      })
                  }
     
      ngOnInit(): void {
        this.getBranchList('')
        this.getCompanyList()
      }
    public getCompnayId(event:any){
        this.getBranchList(event.id)
    }
    public getCompanyList(){
        this.subscription.push(this.generateStempService.getCompanyList().subscribe((res: any) => {
          this.companyList = res.data
        }, error => {
          this.isLoading = false;
          if (error && error.error.errors && error.error.errors.failed) {
            this.toastrService.danger(error.error.errors.failed[0], 'Error');
          }
        }))
    }
    public getBranchList(company_id:any){
        this.isLoading = true;
        let payloadObj:any = {};
        payloadObj.company_id = this.userDetails.company_id ? this.userDetails.company_id : company_id
        this.subscription.push(this.generateStempService.getGenerateStampAllData(payloadObj.company_id).subscribe((res:any)=>{
            this.stempcycleList = res.data
            this.stempcycleList.forEach((el: any) => {
              el.created_at = moment.utc(el.created_at).local().format("DD-MM-YYYY hh:mm A");
            });
            this.isLoading = false;
            // console.log(this.stempcycleList,'getGenerateStempAllData=======');
             this.source.load(this.stempcycleList);
             this.totalCount = res.with.total
        },error => {
          this.isLoading = false;
          if(error && error.error.errors && error.error.errors.failed) {
            // this.toastrService.danger(error.error.errors.failed[0],'Error');
          }
        }))
    }
  
    public generateStemp(){
        this.router.navigate([`pages/generate-stamp/add-edit-stamp`])
    }
    
    public ngOnDestroy() {
      this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  } 
  }