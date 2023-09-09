import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
;
import { ActivatedRoute, Router } from "@angular/router";
import { NbToastrService } from "@nebular/theme";

import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { UserManagementService } from "../../../../../shared/component-services/admin-area-components/user-management.service";
import { UtilService } from "../../../../../shared/common-service/util.service";
import { BannerService } from "../../../../../shared/component-services/admin-area-components/banner.service";
import { BranchService } from "../../../../../shared/component-services/admin-area-components/branch.service";
import { PasswordStrengthValidator } from "../../../../../shared/custom-validator.service.ts/password.validator";
import { CommonService } from "../../../../../shared/common-service/common.service";

@Component({
  selector: 'ngx-add-edit-user-management',
  templateUrl: './add-edit-user-management.component.html',
  styleUrls: ['./add-edit-user-management.component.scss']
})

export class AddEditUserManagementComponent implements OnInit, OnDestroy {
    public subscription: Subscription[] = [];
  
    public userId: any = null;
    public companyId:any = null;
  
    public roleList: Array<any> = [];
    public companyList: Array<any> = [];
    public branchList: Array<any> = [];
    public userData:any;

    public isLoading: boolean = false;
    public showPassword: boolean = false;
    public isCompanyRequired: boolean = false;
    public isBranchRequired: boolean = false;
  
    public setDefaultValue = "Not Applicable";
  
    constructor(
      public userManagementService: UserManagementService,
      public commonService: CommonService,
      public branchService: BranchService,
      public fb: FormBuilder,
      public utilService: UtilService,
      public router: Router,
      public route: ActivatedRoute,
      private toastrService: NbToastrService
    ) {
      this.route.queryParams.subscribe((params: any) => {
        if (params.user_id) {
          this.userId = atob(params.user_id);
        }
        if (this.userId) {
          this.getUserById();
        }
      });
    }
  
    //validators //
    public formValidations: any = {
      role_id: [{ type: 'required', message: 'Role is required' }],
      company_id: [{ type: 'required', message: 'Company is required' }],
      branch_id: [{ type: 'required', message: 'Branch is required' }],
      name: [{ type: 'required', message: 'Name is required' }],
      email: [
        { type: 'required', message: 'Email is required' },
        { type: 'pattern', message: 'Enter valid email' },
      ],
      phone: [{ type: 'required', message: 'Phone is required' }],
      password: [{ type: 'required', message: 'Password is required' },],
    };
  
    userManagementFrom = this.fb.group({
      user_id: new FormControl(),
      company_id: new FormControl(),
      branch_id: new FormControl(),
      name: new FormControl(),
      email: new FormControl('', [Validators.pattern(this.utilService._emialRegExp)]),
      password: new FormControl('', [Validators.minLength(8),PasswordStrengthValidator]),
      country_iso_code: new FormControl('IN'),
      country_code: new FormControl('+91'),
      phone: new FormControl('', [Validators.compose([Validators.required, Validators.minLength(10)])]),
      role_id: new FormControl(),
    });

    ngOnInit(): void {
      this.getRoleList();
      this.getCompanylist();
    }
    public isHideShow() {
      this.showPassword = !this.showPassword
    }

    public getRoleId(event:any){ 
      if(event.slug === 'COMPANY'){
        this.isBranchRequired = false;
      }else{
        this.isBranchRequired = true;
      }
    }
    public getCompanyId(event: any) {
      this.companyId =  event.id;   
      this.userManagementFrom.get('branch_id').setValue(null)    
      this.getBranchList(event.id)
    }

    public getCompanylist() {
      this.subscription.push(this.branchService.getCompanyList().subscribe((res: any) => {
        this.companyList = res.data
      }, error => {
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], 'Error');
        }
      }))
    }
    public getBranchList(company_id:any) {
      let payloadObj:any = {};
      payloadObj.company_id = company_id
      this.subscription.push(this.commonService.getBranchByID(payloadObj).subscribe((res: any) => {
        this.branchList = res.data
      }, error => {
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], 'Error');
        }
      }))
    }
    public getRoleList() {
      this.subscription.push(
        this.userManagementService.getRoleList().subscribe(
          (res: any) => {
            this.roleList = res.data.filter((item:any) => item.slug !== 'SUPERADMIN')
          },
          (error) => {
            if (error && error.error.errors && error.error.errors.failed) {
              this.router.navigate(["pages/admin-area/master/hsn-code-list"]);
              this.toastrService.danger(error.error.errors.failed[0], "Error");
            }
          }
        )
      );
    }
  
    public getUserById(){
      this.subscription.push(
        this.userManagementService.getUserById(this.userId).subscribe(
          (res: any) => {
            this.userData = res.data;
            this.userData.role_id = this.userData?.role?.id
            this.userManagementFrom.patchValue(this.userData)
            this.getBranchList(this.userData.company_id)
            this.userManagementFrom.get('email')?.clearValidators()
            this.userManagementFrom.get('email')?.updateValueAndValidity()
            this.userManagementFrom.get('email')?.disable()
            if(this.userData?.role?.slug === 'COMPANY'){
              this.isBranchRequired = false;
            }else{
              this.isBranchRequired = true;
            }
          },
          (error) => {
            if (error && error.error.errors && error.error.errors.failed) {
              this.router.navigate(["pages/admin-area/master/hsn-code-list"]);
              this.toastrService.danger(error.error.errors.failed[0], "Error");
            }
          }
        )
      );
    }

    public onSubmit() {
      this.isLoading = true;
      this.userManagementFrom.markAllAsTouched();
      if (this.userManagementFrom.invalid) {
        this.isLoading = false;
        return;
      }
      let payloadObj = this.userManagementFrom.value;
      if (this.userId) {
        payloadObj.user_id = parseInt(this.userId);
      }
      payloadObj.password = this.utilService.convertStringBase64(payloadObj.password)
      this.subscription.push(
        this.userManagementService.saveUserRolesManagement(payloadObj).subscribe(
          (res: any) => {
            this.toastrService.success(res.message, "Success");
            this.isLoading = false;
            this.router.navigate(["pages/admin-area/user-management/user-list"]);
          },
          (error) => {
            this.isLoading = false;
            if (error && error.error.errors && error.error.errors.failed) {
              this.toastrService.danger(error.error.errors.failed[0], "Error");
            }
            this.toastrService.danger(error.error.errors.email[0], "Error");
          }
        )
      );
    }
    public back() {
      this.router.navigate(["pages/admin-area/user-management/user-list"]);
    }
    public ngOnDestroy() {
      this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
    }
  }