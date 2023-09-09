import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilService } from '../../../../../shared/common-service/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { MenuService } from '../../../../../shared/component-services/admin-area-components/menu.service';

@Component({
  selector: 'ngx-add-edit-menu',
  templateUrl: './add-edit-menu.component.html',
  styleUrls: ['./add-edit-menu.component.scss']
})
export class AddEditMenuComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];
  public addEditMenuForm: FormGroup;
  public isLoading: boolean = false;
  public menuId: any = null;
  public menuName = null;
  public menuType = null;
  public selectedMenuData: any = null;
  public editMenuObj: any = null;

  public formValidations: any = {
    name: [{ type: "required", message: "Menu Name is required" }],
    url: [{ type: "required", message: "URL is required" }]
  };
  constructor(
    private fb: FormBuilder,
    public utilService: UtilService,
    public router: Router,
    public route: ActivatedRoute,
    private toastrService: NbToastrService,
    public menuService: MenuService
    ) { 
      this.route.queryParams.subscribe((params: any) => {
        if(params) {
          this.menuName = params.name;
          this.menuType = params.menu_type;
          this.selectedMenuData = JSON.parse(localStorage.getItem('parentMenuDetail'));
          if(params.menu_id) {
            this.menuId = atob(params.menu_id);
            this.editMenuObj = JSON.parse(localStorage.getItem('selctedEditMenuDetail'));
            this.menuName = this.editMenuObj.parent_menu_name;
          }
        } else {
          localStorage.removeItem("parentMenuDetail");
          localStorage.removeItem("selctedEditMenuDetail");
        }
      })
    }

  ngOnInit(): void {
    this.addEditMenuForm = this.fb.group({
      menu_id: [this.menuId ? this.menuId : 0, Validators.required],
      parent_id: [(this.menuId && this.editMenuObj.isChildMenu) ? this.editMenuObj.parent_id : 0],
      name: [this.menuId ? this.editMenuObj.name : null, Validators.required],
      url: [this.menuId ? this.editMenuObj.url : null, Validators.required],
      icon_css_class: [this.menuId ? this.editMenuObj.icon_css_class : null],
      is_only_for_admin: [(this.menuId && this.editMenuObj.is_only_for_admin === 1) ? true : false]
    });
    if(this.selectedMenuData && this.selectedMenuData.id && !this.menuId) {
      this.addEditMenuForm.get('parent_id').setValue(this.selectedMenuData.id);
    }
  }

  public onSubmit() {
    this.isLoading = true;
    this.addEditMenuForm.markAllAsTouched();
    if (this.addEditMenuForm.invalid) {
      this.isLoading = false;
      return;
    }
    let payloadObj = this.addEditMenuForm.value;
    this.subscription.push(
      this.menuService.onSaveMenuData(payloadObj).subscribe(
        (res: any) => {
          this.toastrService.success(res.message, "Success");
          this.isLoading = false;
          localStorage.removeItem("parentMenuDetail");
          localStorage.removeItem("selctedEditMenuDetail");
          this.router.navigate(["pages/admin-area/user-management/menu-list"]);
        },
        (error) => {
          this.isLoading = false;
          if (error && error.error.errors && error.error.errors.failed) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      )
    );
  }

  public back() {
    this.router.navigate(["pages/admin-area/user-management/menu-list"]);
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }
}
