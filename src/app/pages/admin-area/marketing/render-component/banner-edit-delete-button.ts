import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { BannerService } from '../../../../shared/component-services/admin-area-components/banner.service';
import { UtilService } from '../../../../shared/common-service/util.service';
import { ConfirmModalComponent } from '../../../../shared/modal-service/confirm-modal/confirm-modal.component';
 

@Component({
  selector: 'ngx-account-view',
  template: `
  <nb-icon class="edit-icons pointer nb-edit" nbTooltip="Edit" nbTooltipPlacement="bottom" (click)="onEditBanner(rowData)"
  *ngIf="onPermission?.update"></nb-icon>
  <nb-icon class="delete-icons pointer nb-trash" nbTooltip="Delete" nbTooltipPlacement="bottom" (click)="onDeleteBanner(rowData)"
  *ngIf="onPermission?.delete"></nb-icon>
  `,
})
export class BannerRenderComponent {
  @Input() rowData: any;
  public onPermission : any = {
    access : false,
    create  :  false,
    update : false,
    view : false,
    delete : false,
  }

  constructor(  
    public Bannerervice: BannerService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    public router: Router,
    public utilService: UtilService
    ) { 
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

public onEditBanner(event:any):void {
    this.router.navigate([`/pages/admin-area/marketing/add-edit-banner`], { queryParams: {branch_id :btoa(event.id)}});
}
 

public onDeleteBanner(event: any): void {
  this.dialogService.open(ConfirmModalComponent, {
      context: {
        data: "Are you sure want to delete?",
      },
    })
    .onClose.subscribe((confirm: any) => {
      if (confirm) {
        // event.confirm.resolve(event.newData);
       this.Bannerervice.deleteBanner(event.harmonized_system_code_id).subscribe(
              (res: any) => {
                this.toastrService.success(res.message, "Success");
                this.utilService.deleteEmmiter.next(true);
              },
              (error) => {
                if (  error &&  error.error.errors &&error.error.errors.failed
                ) {
                  this.toastrService.danger(  error.error.errors.failed[0],"Error" );
                }
              }
            );
      }
    });
}
}