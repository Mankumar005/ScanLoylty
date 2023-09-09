import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../../../@core/data/smart-table';
import { Router } from '@angular/router';
import { CompanyService } from '../../../../../shared/component-services/admin-area-components/company.service';
import { CompanyRenderComponent } from '../render-component/company-edit-view-button';
import { Subscription } from 'rxjs';
import { UtilService } from '../../../../../shared/common-service/util.service';
@Component({
  selector: 'ngx-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];
  public companyList: any = []
  public status: NbComponentStatus[] = ['primary'];

  public isLoading: boolean = false;

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
      company_name: {
        title: 'Company Name',
        type: 'string',
      },
      companyType: {
        title: 'Company Type',
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

  constructor(
    public service: SmartTableData,
    public utilService: UtilService,
    public companyService: CompanyService,
    public router: Router,
    private toastrService: NbToastrService,) 
    {
      let userPermession: any = [];
      userPermession = this.utilService.getLocalStorageValue('userDetail');
      let permissionData = userPermession.menu_permissions.filter(function (element: any) {
        return element.code === 'ADMIN_AREA'});
          permissionData[0].children_menus.forEach((menu:any)=>{
              if(menu.code === 'MASTER'){
                menu.children_menus.forEach((menu:any)=>{
                  if(menu.code === 'COMPANY'){
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
    this.getCompanyList()
  }

  public getCompanyList() {
    this.isLoading = true;
    this.subscription.push(this.companyService.getCompanyList().subscribe((res: any) => {
      this.companyList = res.data
      this.isLoading = false;

      this.companyList.forEach((element: any) => {
        element.companyType = element.company_type.company_type_name
      })
      this.source.load(this.companyList);
      this.totalCount = res.with.total
    }, error => {
      this.isLoading = false;
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public redirectToAddEditCompany() {
    this.router.navigate([`/pages/admin-area/master/add-edit-company`], { queryParams: { is_add: true } });
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }
}
