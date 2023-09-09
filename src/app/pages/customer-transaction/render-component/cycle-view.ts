import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../../shared/common-service/util.service';

@Component({
  selector: 'ngx-account-view',
  template: `
  <nb-icon class="nb-view pointer view-icon" nbTooltip="View Stamp" nbTooltipPlacement="bottom" icon="eye-outline" (click)="onViewCustomerDetails(rowData)"
   ></nb-icon>
  `,
})
export class CycleRenderComponent {
  @Input() rowData: any;
  public userDetails: any;
  public pageName: any;
  public onPermission : any = {
    access : false,
    create  :  false,
    update : false,
    view : false,
    delete : false,
  }

  constructor(
    public router: Router,
    public utilService: UtilService,
    public activatedRoute: ActivatedRoute
              ) { 
    // this.pageName = this.activatedRoute.snapshot.url[0].path;
    // this.userDetails = this.utilService.getLocalStorageValue("userDetail");
    // if (this.userDetails && this.userDetails.menu_permissions.length) {
    //   this.userDetails.menu_permissions.forEach((menuPermission: any) => {
    //     if (menuPermission.menu_code === 'ADMIN_AREA') {
    //       if (menuPermission.children_menus && menuPermission.children_menus.length) {
    //         menuPermission.children_menus.forEach((childMenuPermission: any) => {
    //           if (childMenuPermission.menu_code === 'ACCOUNTS') {
    //             if (childMenuPermission.children_menus && childMenuPermission.children_menus.length) {
    //               childMenuPermission.children_menus.forEach((childInChildMenu: any) => {
    //                 if(childInChildMenu.menu_code === 'APPROVED_ACCOUNT' && this.pageName === 'approved-account') {
    //                   if(childMenuPermission?.permissions?.length) {
    //                     childMenuPermission.permissions.forEach((childMenu: any) => {
    //                       if(childMenu.permission_slug === 'VIEW') {
    //                         this.onPermission.view = true;
    //                       }
    //                     });
    //                   }
    //                 }
    //                 if(childInChildMenu.menu_code === 'PENDING_ACCOUNT' && this.pageName === 'pending-account') {
    //                   if(childMenuPermission?.permissions?.length) {
    //                     childMenuPermission.permissions.forEach((childMenu: any) => {
    //                       if(childMenu.permission_slug === 'VIEW') {
    //                         this.onPermission.view = true;
    //                       }
    //                     });
    //                   }
    //                 }
    //               });
    //             }
    //           }
    //         });
    //       }
    //     }
    //   });
    // }
  }

public onViewCustomerDetails(event:any):void {
  let cycleObj :any = {};
  cycleObj.view = 'view-stamp',
  cycleObj.id = event.customer_cycle_id
  localStorage.setItem('cycleObj',JSON.stringify(cycleObj));
 this.utilService.storeEventData.next('view-stamp');
}
 
}