import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '../../../../../shared/common-service/util.service';

@Component({
  selector: 'ngx-account-view',
  template: `
  <nb-icon class="edit-icon-comapny pointer nb-edit" nbTooltip="Edit" nbTooltipPlacement="bottom" (click)="onEditCompany(rowData)"
  *ngIf="onPermission?.update"></nb-icon>
  `,
})
export class CompanyRenderComponent {
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
    )
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
     

public onEditCompany(event:any):void {
    this.router.navigate([`/pages/admin-area/master/add-edit-company`], { queryParams: {company_id : btoa(event.id)}});
}
 
}