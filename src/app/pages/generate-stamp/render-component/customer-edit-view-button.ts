import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '../../../shared/common-service/util.service';

@Component({
  selector: 'ngx-account-view',
  template: `
  <nb-icon class="view-icon nb-view pointer" nbTooltip="View" nbTooltipPlacement="bottom" icon="eye-outline" (click)="viewGeneratedStampDetails(rowData)"
  *ngIf="onPermission?.view"></nb-icon>
  `,
})
// <nb-icon class="edit-icon pointer nb-edit" nbTooltip="Edit" nbTooltipPlacement="bottom" (click)="editStampDetails(rowData)"></nb-icon>

export class GenerateStempRenderComponent {

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
    public utilService: UtilService
    ) { 
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

public viewGeneratedStampDetails(event:any):void {
    this.router.navigate([`pages/generate-stamp/stamp-details`], { queryParams: {stamp_id : btoa(event.id)}});
}

public editStampDetails(event:any):void {
  this.router.navigate([`/pages/generate-stamp/add-edit-stamp`], { queryParams: {stamp_id : btoa(event.id)}});
}
 

}