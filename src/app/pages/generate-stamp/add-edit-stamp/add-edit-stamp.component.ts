import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilService } from '../../../shared/common-service/util.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription, fromEvent } from 'rxjs';
import { ConfirmModalComponent } from '../../../shared/modal-service/confirm-modal/confirm-modal.component';
import { GenerateStempService } from '../../../shared/component-services/generate-stemp.service';
import { CustomerService } from '../../../shared/component-services/customer.service';
import { CommonService } from '../../../shared/common-service/common.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { id } from '@swimlane/ngx-charts';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
 
@Component({
  selector: 'ngx-add-edit-stamp',
  templateUrl: './add-edit-stamp.component.html',
  styleUrls: ['./add-edit-stamp.component.scss']
})
export class AddEditStampComponent implements OnInit, OnDestroy,AfterViewChecked {
    @ViewChild("getOfferDescription", { static: false }) getOfferDescription!: ElementRef;
    @ViewChild("getFile") public getFile: any;
    public subscription: Subscription[] = [];
    public generateStampForm: FormGroup;
    public stampCycleArray: FormArray;
  
    public urls: Array <any> = [] ;
    public companyList: Array<any> = [];
    public branchList: Array<any> = [];

    public generateStampData: any = {};
    public fileObj: any = {};
    public userDetails: any = {};
    public offerImageObj: any = {};
    public companyId:any = null;
    public branchId:any = null;
    public userRole:any = null;

    public isLoading: boolean = false;
    public isGenerateStampData: boolean = false;
    public isChecked: boolean = false;
    public isRequired: boolean = true;
    public isShowError: boolean = false;
    public isUploadImg: boolean = true;
    public isWrongResumeUpload: boolean = false;

    public selectCompanyValue: any = "";
    public selectBranchValue: any = "";

    public source: LocalDataSource = new LocalDataSource();
    public generateStampCount: number = 0;
    public pageSize: number = 10;
    public currentPage: number = 1;
    public showPerPage: number = 9;
    public totalCount: any;
  
    public fileToUploadName: any = "";
    public uploadedFileName: any = "";
  
    public stampId: any = null;
    public fileName: any;
    public fileUrl: any;
    public desValue: any;
  
  
    public formValidations: any = {
      company_id: [{ type: 'required', message: 'Company is required' }],
      branch_id: [{ type: 'required', message: 'Branch is required' }],
      stamp_cycle_name: [{ type: 'required', message: 'Stamp Cycle Name is required' }],
      stamp_cycle_no: [{ type: 'required', message: 'No Of Stamp/Cycle is required' }],
      offer_description: [{ type: 'required', message: 'Offer Description is required' }],
      offer_image: [{ type: 'required', message: 'Offer Image is required' }],
    }
  
    constructor(
      private readonly changeDetectorRef: ChangeDetectorRef,
      public customerService: CustomerService,
      public jwtHelper : JwtHelperService,
      public commonService: CommonService,
      public fb: FormBuilder,
      public router: Router,
      public route: ActivatedRoute,
      public generateStampService: GenerateStempService,
      public utilService: UtilService,
      private toastrService: NbToastrService,
      private dialogService: NbDialogService,
    ) {
      this.route.queryParams.subscribe((params: any) => {
        if(params.stamp_id){
          this.stampId = atob(params.stamp_id);
          if (this.stampId) {
            this.getGenerateStampData(this.stampId)
          }
        }
      });
    }
  
    ngOnInit(): void {
      this.generateStampForm = this.fb.group({
        user_id: new FormControl(),
        company_id: new FormControl(),
        // branch_id: new FormControl(),
        stamp_cycle_name: new FormControl(''),
        stamp_cycle_no: new FormControl(''),
        stampCycleArray: this.fb.array([this.createStempArray()])
      })
      this.userRole =  this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
      this.userDetails = this.utilService.getLocalStorageValue('userDetail')
      if(this.userRole.role === 'SUPERADMIN'){
        this.generateStampForm.get('company_id')?.setValue(this.userDetails?.company_id)
        this.generateStampForm.get('branch_id')?.setValue(this.userDetails?.branch_id)
      }
      if(this.userRole.role === 'COMPANY'){
        this.generateStampForm.get('company_id')?.setValue(this.userDetails?.company_id)
        this.generateStampForm.get('branch_id')?.setValue(this.userDetails?.branch_id)
        this.generateStampForm.get('company_id')?.disable()
        this.getCustomerBranchlist(this.userDetails?.company_id)
      }
      if(this.userRole.role === 'BRANCH_EXECUTIVE'){
        this.generateStampForm.get('company_id')?.setValue(this.userDetails?.company_id)
        this.generateStampForm.get('branch_id')?.setValue(this.userDetails?.branch_id)
        this.generateStampForm.get('company_id')?.disable()
        this.generateStampForm.get('branch_id')?.disable()
        this.getCustomerBranchlist(this.userDetails?.company_id)
       }
       if(this.userRole.role === 'BRANCH'){
        this.generateStampForm.get('company_id')?.setValue(this.userDetails?.company_id)
        this.generateStampForm.get('branch_id')?.setValue(this.userDetails?.branch_id)
        this.generateStampForm.get('company_id')?.disable()
        this.generateStampForm.get('branch_id')?.disable()
        this.getCustomerBranchlist(this.userDetails?.company_id)
       }
      this.getAllCompanys();
    }
  
    public createStempArray() {
      return this.fb.group({
        stamp_sequence_no: [''],
        is_offer: [0],
        offer_description: [''],
        offer_image: [''],
        image_url: [''],
      })
    }

  public getAllCompanys() {
    this.subscription.push(this.commonService.getAllCompanys().subscribe(
      (res: any) => {
        this.companyList = res.data;
      },
      (error) => {
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], "Error");
        }
      }
    ));
  }
  public getCustomerBranchlist(company_id:any) {
    let payloadObj:any = {};
    payloadObj.company_id = company_id
    this.subscription.push(this.commonService.getBranchByID(payloadObj).subscribe(
      (res: any) => {
        this.branchList = res.data;
      },
      (error) => {
        if (error && error.error.errors && error.error.errors.failed) {
          // this.toastrService.danger(error.error.errors.failed[0], "Error");
        }
      }
    ));
  }
  public changeFn(event: any) {
    this.companyId =  event.id;       
    this.getCustomerBranchlist(event.id)
  }
  public getSelectedBranchId(branch_id: any) {
    this.branchId = branch_id;
  }
    //patchValue in stamp form //
    public getGenerateStampData(id: any) {
      this.subscription.push(this.generateStampService.getGenerateStampDataById(id).subscribe((res: any) => {
        this.isLoading = false;
        this.generateStampForm.patchValue(res.data)
        this.generateStampData = res.data
        if (this.generateStampData.stamp_cycle_detail.length) {
          this.isGenerateStampData = true;
          for (var i = 0; i < this.generateStampData.stamp_cycle_detail.length; i++) {
            (this.generateStampForm.get('stampCycleArray') as FormArray).push(this.createStempArray());
          }
          this.setValueInStampArray()
        }
      }, error => {
        this.isLoading = false;
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], 'Error');
        }
      }))
    }
    //setValue in FormArray//
    public setValueInStampArray() {
      const stempArray = this.generateStampForm.get('stampCycleArray') as FormArray;
      stempArray.clear();
      this.generateStampData.stamp_cycle_detail.forEach((value: any) => {
        const group = this.createStempArray();
        group.patchValue(value);
        stempArray.push(group);      
        this.fileName = value.image
      });
    }
    public onConfirmGenerateStamp(): void {
      this.generateStampForm.markAllAsTouched();
      if(!this.generateStampForm.get('stamp_cycle_name')?.value || !this.generateStampForm.get('stamp_cycle_no')?.value){
        return;
      }
      this.dialogService.open(ConfirmModalComponent, {
        context: {
          data: "Are you sure want to generate stamp?",
        },
      })
        .onClose.subscribe((confirm: any) => {
          if (confirm) {
            this.generateStamp()
          }
        })
    }
    public generateStamp() {
      this.isLoading = false;
      this.isGenerateStampData = true;
      this.stampCycleArray = this.generateStampForm.get('stampCycleArray') as unknown as FormArray;
      this.clearFormArray(this.stampCycleArray)
      this.generateStampCount = this.generateStampForm.get('stamp_cycle_no')?.value
      this.stampCycleArray = this.generateStampForm.get('stampCycleArray') as unknown as FormArray;
      for (var i = 0; i < this.generateStampCount; i++) {
        this.stampCycleArray.push(this.createStempArray());
        this.isRequired = true;
      }
    }
    public clearFormArray(stampCycleArray: FormArray) {
      while (stampCycleArray.length !== 0) {
        stampCycleArray.removeAt(0)
      }
    }
    public getControls(i:any) {
      return (this.generateStampForm.get('stampCycleArray') as FormArray).controls;
    }
  
    public isCheckBox(event: any, i: any) {
      if(event){
        if ((this.generateStampForm.get('stampCycleArray') as FormArray).at(i).value.is_offer) {
          (this.generateStampForm.get('stampCycleArray') as FormArray).at(i).get('is_offer')?.setValue(1);
          (this.generateStampForm.get('stampCycleArray') as FormArray).at(i).get('offer_description')?.setValidators([Validators.required]);
          (this.generateStampForm.get('stampCycleArray') as FormArray).at(i).get('offer_description')?.updateValueAndValidity();
          (this.generateStampForm.get('stampCycleArray') as FormArray).at(i).get('offer_image')?.setValidators([Validators.required]);
          (this.generateStampForm.get('stampCycleArray') as FormArray).at(i).get('offer_image')?.updateValueAndValidity();
          this.generateStampForm.markAllAsTouched();
        }
      }else{
        (this.generateStampForm.get('stampCycleArray') as FormArray).at(i).get('offer_description')?.clearValidators();
        (this.generateStampForm.get('stampCycleArray') as FormArray).at(i).get('offer_description')?.updateValueAndValidity();
        (this.generateStampForm.get('stampCycleArray') as FormArray).at(i).get('offer_image')?.clearValidators();
        (this.generateStampForm.get('stampCycleArray') as FormArray).at(i).get('offer_image')?.updateValueAndValidity();
        (this.generateStampForm.get('stampCycleArray') as FormArray).at(i).get('offer_description')?.setValue('');
        (this.generateStampForm.get('stampCycleArray') as FormArray).at(i).get('is_offer')?.setValue(0);
        (this.generateStampForm.get('stampCycleArray') as FormArray).at(i).get('offer_image')?.setValue('');
        (this.generateStampForm.get('stampCycleArray') as FormArray).at(i).get('image_url')?.setValue('');
      }
    }
    // upload file  //
    /*Upload File ot Image */
    public onSelectFile(event: any, index: any) {
      if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();
          reader.onload = (event: any) => {
              (this.generateStampForm.get('stampCycleArray') as FormArray).at(index).get('image_url')?.setValue(event.target.result);  
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      }
      for (var i = 0; i < event.target.files.length; i++) {
        (this.generateStampForm.get('stampCycleArray') as FormArray).at(index).get('offer_image')?.setValue(event.target.files[i]); 
      }
    }
    public removeOfferImage(i: any) {
      (this.generateStampForm.get('stampCycleArray') as FormArray).at(i).get('image_url')?.setValue(null);
      (this.generateStampForm.get('stampCycleArray') as FormArray).at(i).get('offer_image')?.setValue(''); 
    }
    public removeStemp(i: any) {
      (this.generateStampForm.get('stampCycleArray') as FormArray).removeAt(i);
    }
    public removeIcon(type: any) {
      this.getFile = "";
      this.generateStampForm.get("offer_image")?.setValue(null);
    }
    public checkIsOffers(element:any) {
      return element === 0;
    }
    public onSubmit() {
      this.generateStampForm.markAllAsTouched()
      let isOfferFound = (this.generateStampForm.get('stampCycleArray') as FormArray)?.value.filter(function(value:any) {
        return value.is_offer == true;
      });
      if(!isOfferFound.length){
        this.isShowError = true;
        this.isLoading = false;
        return
      }else{
        this.isShowError = false;
      }
      if(this.generateStampForm.invalid){
         this.isLoading = false;
        return;
      }
      this.isLoading = true;
      let payloadObj: any = {};
      payloadObj = this.generateStampForm.value
      if(this.userRole.role === 'SUPERADMIN'){
        payloadObj.company_id =  payloadObj.company_id
        payloadObj.branch_id = payloadObj.branch_id
      }
      if(this.userRole.role === 'COMPANY'){
        payloadObj.company_id = this.userDetails?.company_id
        payloadObj.branch_id = payloadObj.branch_id
      }else{
        payloadObj.company_id = payloadObj.company_id
        payloadObj.branch_id = payloadObj.branch_id
      }
      if(this.userRole.role === 'BRANCH_EXECUTIVE'){
        payloadObj.company_id = this.userDetails?.company_id
        payloadObj.branch_id = this.userDetails?.branch_id
       }else{
        payloadObj.company_id = payloadObj.company_id
        payloadObj.branch_id = payloadObj.branch_id
      }
       if(this.userRole.role === 'BRANCH'){
        payloadObj.company_id = this.userDetails?.company_id
        payloadObj.branch_id = this.userDetails?.branch_id
       }else{
        payloadObj.company_id = payloadObj.company_id
        payloadObj.branch_id = payloadObj.branch_id
      }
      payloadObj.stamp_cycle_no = parseInt(payloadObj.stamp_cycle_no);
      payloadObj.stemp_cycle_details = payloadObj.stampCycleArray
      payloadObj.stemp_cycle_details.forEach((element: any, i: any) => {
        this.offerImageObj[`offer_image[${i + 1}]`] = element.offer_image
      })
      // payloadObj.stemp_cycle_details.forEach((elements: any) => {
      //   delete elements.offer_image
      // })
      delete payloadObj.stampCycleArray
      // console.log(payloadObj, '======this.payloadObj======');
      this.subscription.push(this.generateStampService.saveGenerateStampData(payloadObj).subscribe((res: any) => {
        this.isLoading = false;
        this.storeOfferImages(res.data.stamp_cycle_id)
        this.toastrService.success(res.message, 'Success');
      }, error => {
        this.isLoading = false;
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], 'Error');
        }
      }))
    }
    public storeOfferImages(id: any) {
      this.offerImageObj.stamp_cycle_id = id
      const fd = this.utilService.genrateFormData(this.offerImageObj)
      this.subscription.push(this.generateStampService.saveOfferImage(fd).subscribe((res: any) => {
        this.isLoading = false;
        this.router.navigateByUrl('/pages/generate-stamp/stamp-list')
      }, error => {
        this.isLoading = false;
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], 'Error');
        }
      }))
    }
    public back() {
      this.router.navigateByUrl('/pages/generate-stamp/stamp-list')
    }
    public ngAfterViewChecked(): void {
      this.changeDetectorRef.detectChanges();
    }
    public ngOnDestroy() {
      this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
    }
  }
