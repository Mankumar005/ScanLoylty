import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { SmartTableData } from '../../../../@core/data/smart-table';
import { Router } from '@angular/router';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { BannerService } from '../../../../shared/component-services/admin-area-components/banner.service';
import { ConfirmModalComponent } from '../../../../shared/modal-service/confirm-modal/confirm-modal.component';
import { BannerRenderComponent } from '../render-component/banner-edit-delete-button';
import { UtilService } from '../../../../shared/common-service/util.service';

@Component({
  selector: 'ngx-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.scss']
})
export class BannerListComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];

  public allBranchList: Array <any> = []
  public status: NbComponentStatus[] = [ 'primary'];
  
  public isLoading: boolean = false;
  
  public source: LocalDataSource = new LocalDataSource();
  pageSize = 10;
  currentPage = 1;
  showPerPage = 9;
  totalCount:any;
  // index : any;
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
        branch_name: {
          title: 'Branch Name',
          type: 'string',
        },
        contact_person_name: {
          title: 'Person Name',
          type: 'string',
        },
        email: {
          title: 'E-mail',
          type: 'string',
        },
        phone: {
          title: 'Phone',
          type: 'number',
        },
        action:{
          title: 'Action',
          type: 'custom',
          filter:false,
          sort: false,
          position: 'right',
          renderComponent: BannerRenderComponent
        }
      },
    };
  
    constructor(public service: SmartTableData,
                public utilService: UtilService,
                public bannerService: BannerService,
                public router : Router,
                private toastrService: NbToastrService,
                private dialogService: NbDialogService,) 
                {
                  let userPermession: any = [];
                  userPermession = this.utilService.getLocalStorageValue('userDetail');
                  let permissionData = userPermession.menu_permissions.filter(function (element: any) {
                    return element.code === 'ADMIN_AREA'});
                      permissionData[0].children_menus.forEach((menu:any)=>{
                          if(menu.code === 'MARKETING'){
                            menu.children_menus.forEach((menu:any)=>{
                              if(menu.code === 'BANNER_LIST'){
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
                 }
   
    ngOnInit(): void {
      this.getBranchList()
    }
  
  public getBranchList(){
      this.isLoading = true;
      this.subscription.push(this.bannerService.getBannerList().subscribe((res:any)=>{
          this.allBranchList = res.data
          this.isLoading = false;
           this.source.load(this.allBranchList);
           this.totalCount = res.with.total
      },error => {
        this.isLoading = false;
        if(error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0],'Error');
        }
      }))
  }
  
  public onDeleteConfirm(event: any): void {
    this.dialogService.open(ConfirmModalComponent, {
        context: {
          data: "Are you sure want to delete?",
        },
      })
      .onClose.subscribe((confirm: any) => {
        if (confirm) {
          // event.confirm.resolve(event.newData);
          this.subscription.push(this.bannerService.deleteBanner(event.data.harmonized_system_code_id).subscribe(
                (res: any) => {
                  this.toastrService.success(res.message, "Success");
                },
                (error) => {
                  if (  error &&  error.error.errors &&error.error.errors.failed
                  ) {
                    this.toastrService.danger(  error.error.errors.failed[0],"Error" );
                  }
                }
              )
          );
        }
      });
  }

  public redirectToAddBanner(): void {
    this.router.navigate([`/pages/admin-area/marketing/add-edit-banner`]);
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }
}
