import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../../../@core/data/smart-table';
import { Router } from '@angular/router';
import { UserRolesService } from '../../../../../shared/component-services/admin-area-components/user-role.service';
import { Subscription } from 'rxjs';
import { UserRoleRenderComponent } from '../render-component/user-edit-delete-button';
import { UtilService } from '../../../../../shared/common-service/util.service';
 
@Component({
  selector: 'ngx-user-roles-list',
  templateUrl: './user-roles-list.component.html',
  styleUrls: ['./user-roles-list.component.scss']
})
export class UserRolesListComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];
  public userserRoleList: Array<any> = [];
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
       },
       
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      slug: {
        title: 'Roles',
        type: 'string',
      },
      action:{
        title: 'Action',
        type: 'custom',
        filter:false,
        sort: false,
        position: 'right',
        renderComponent: UserRoleRenderComponent
      }
    }
  };
  constructor(
    public service: SmartTableData,
    public utilService: UtilService,
    public userRoleService: UserRolesService,
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
                if(menu.code === 'ROLE_LIST'){
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
    this.subscription.push(this.userRoleService.getUserRoleData().subscribe(
      (res: any) => {
        this.userserRoleList = res.data;
        this.isLoading = false;
        this.source.load(this.userserRoleList);
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
  this.router.navigate([`/pages/admin-area/user-management/add-edit-user-role`]);
}
public ngOnDestroy() {
  this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
}
}
 
