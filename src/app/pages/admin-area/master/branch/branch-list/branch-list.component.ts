import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { SmartTableData } from '../../../../../@core/data/smart-table';
import { BranchService } from '../../../../../shared/component-services/admin-area-components/branch.service';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { BranchRenderComponent } from '../render-component/branch-edit-view-button';
import { Subscription } from 'rxjs';
import { UtilService } from '../../../../../shared/common-service/util.service';

@Component({
  selector: 'ngx-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];
  public allBranchList: Array<any> = [];
  public companyList: Array<any> = [];

  public isLoading: boolean = false;

  public source: LocalDataSource = new LocalDataSource();
  pageSize = 10;
  currentPage = 1;
  showPerPage = 9;
  totalCount: any;
  public onPermission: any = {
    access: false,
    create: false,
    update: false,
    view: false,
    delete: false,
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
      action: {
        title: 'Action',
        type: 'custom',
        filter: false,
        sort: false,
        position: 'right',
        renderComponent: BranchRenderComponent
      }
    },
  };

  constructor(
    public service: SmartTableData,
    public utilService: UtilService,
    public branchService: BranchService,
    public router: Router,
    private toastrService: NbToastrService,) {
    let userPermession: any = [];
    userPermession = this.utilService.getLocalStorageValue('userDetail');
    let permissionData = userPermession.menu_permissions.filter(function (element: any) {
      return element.code === 'ADMIN_AREA'
    });
    permissionData[0].children_menus.forEach((menu: any) => {
      if (menu.code === 'MASTER') {
        menu.children_menus.forEach((menu: any) => {
          if (menu.code === 'BRANCH') {
            menu.permissions.filter((menu: any) => {
              if (menu.slug === 'ACCESS') {
                this.onPermission.access = true;
              }
              if (menu.slug === 'VIEW') {
                this.onPermission.view = true;
              }
              if (menu.slug === 'UPDATE') {
                this.onPermission.update = true;
              }
              if (menu.slug === 'CREATE') {
                this.onPermission.create = true;
              }
              if (menu.slug === 'DELETE') {
                this.onPermission.delete = true;
              }
            })
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
    this.subscription.push(this.branchService.getCompanyList().subscribe((res: any) => {
      this.companyList = res.data
    }, error => {
      this.isLoading = false;
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public getBranchList(company_id:any) {
    this.isLoading = true;
    this.subscription.push(this.branchService.getBranchList(company_id).subscribe((res: any) => {
      this.allBranchList = res.data
      this.isLoading = false;
      this.source.load(this.allBranchList);
      this.totalCount = res.with.total
    }, error => {
      this.isLoading = false;
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public redirectToAddEditBranch() {
    this.router.navigate([`/pages/admin-area/master/add-edit-branch`], { queryParams: { is_add: true } });
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }

}
