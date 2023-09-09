import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../../shared/common-service/util.service';

@Component({
  selector: 'ngx-account-view',
  template: `
  <nb-icon class="nb-view pointer view-icon" nbTooltip="View" nbTooltipPlacement="bottom" icon="eye-outline" (click)="onViewCustomerDetails(rowData)"
  *ngIf="onPermission?.view"></nb-icon>
  `,
})
export class CustomerRenderComponent {
  @Input() rowData: any;
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
    let userPermession: any = [];
    userPermession = this.utilService.getLocalStorageValue('userDetail');
    let permissionData = userPermession.menu_permissions.filter(function (element: any) {
      return element.code === 'CUSTOMER'});
      permissionData[0].permissions.filter((menu:any) =>{
              if(menu.slug === 'VIEW'){
              this.onPermission.view = true;
              } 
      })
     }

public onViewCustomerDetails(event:any):void {
    this.router.navigate([`/pages/customer/customer-details`], { queryParams: {customer_id : btoa(event.id)}});
}
 
}