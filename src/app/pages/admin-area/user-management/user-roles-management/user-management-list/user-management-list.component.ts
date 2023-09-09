import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../../../@core/data/smart-table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilService } from '../../../../../shared/common-service/util.service';
import { UserManagementRenderComponent } from '../render-component/user-edit-delete-button';
import { UserManagementService } from '../../../../../shared/component-services/admin-area-components/user-management.service';
@Component({
  selector: 'ngx-user-management-list',
  templateUrl: './user-management-list.component.html',
  styleUrls: ['./user-management-list.component.scss']
})

export class UserManagementListComponent implements OnInit, OnDestroy {
    public subscription: Subscription[] = [];
    public userRoleList: Array<any> = [];
    public userCompanylist: Array<any> = [];
    public userBranchlist: Array<any> = [];
  
    public status: NbComponentStatus[] = ["primary"];
  
    public customerId: any = '';
    public companyId: any = '';
    public branchId: any = '';
    public selectBranchValue: any = ''
   
    public isLoading: boolean = false;
    public isActiveDeactive: any = "1";
  
    public source: LocalDataSource = new LocalDataSource();
    public pageSize = 10;
    public currentPage = 1;
    public showPerPage = 9;
    public totalCount: any;
    public onPermission : any = {
      access : false,
      create  :  false,
      update : false,
      view : false,
      delete : false,
    }
    settings = {
      actions:false,
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
        role_name: {
          title: 'Roles',
          type: 'string',
        },
        name: {
          title: 'Name',
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
        action:{
          title: 'Action',
          type: 'custom',
          filter:false,
          sort: false,
          position: 'right',
          renderComponent: UserManagementRenderComponent
        }
      }
    };
    constructor(
      public service: SmartTableData,
      public utilService: UtilService,
      public userManagementService: UserManagementService,
      public router: Router,
      private toastrService: NbToastrService
    ) {
      let userPermession: any = [];
      userPermession = this.utilService.getLocalStorageValue('userDetail');
      let permissionData = userPermession.menu_permissions.filter(function (element: any) {
        return element.code === 'ADMIN_AREA'});
          permissionData[0].children_menus.forEach((menu:any)=>{
              if(menu.code === 'USER_MANAGEMENT'){
                menu.children_menus.forEach((menu:any)=>{
                  if(menu.code === 'USER_LIST'){
                    menu.permissions.filter((menu:any) =>{
                      if(menu.slug === 'ACCESS'){
                        this.onPermission.access = true;
                      } 
                      if(menu.slug === 'VIEW'){
                        this.onPermission.view = true;
                      }
                      if(menu.slug === 'UPDATE'){
                        this.onPermission.update = true;
                      }
                      if(menu.slug === 'CREATE'){
                        this.onPermission.create = true;
                      } 
                      if(menu.slug === 'DELETE'){
                        this.onPermission.delete = true;
                      }   
                     })
                  }
                })
          }
        })
      this.utilService.deleteEmmiter.subscribe((res: any) => {
        if(res) {
          this.getUserserRoleList();
        }
      })
    }
  
    ngOnInit(): void {
      this.getUserserRoleList();
    }

    public getUserserRoleList() {
      this.isLoading = true;
      this.subscription.push(this.userManagementService.getUserList().subscribe(
        (res: any) => {          
          this.userRoleList = res.data;
          this.userRoleList.forEach((element:any)=>[
            element.role_name = element?.role?.name
          ])
          this.isLoading = false;
          this.source.load(this.userRoleList);
        },
        (error) => {
          this.isLoading = false;
          if (error && error.error.errors && error.error.errors.failed) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      ))
    }
  
   
  public redirectToAddUserRole(){
    this.router.navigate([`/pages/admin-area/user-management/add-edit-user`]);
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }
  }