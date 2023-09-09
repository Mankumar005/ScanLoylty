import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { BannerService } from '../../../../shared/component-services/admin-area-components/banner.service';
import { UtilService } from '../../../../shared/common-service/util.service';
import { NbToastrService } from '@nebular/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-add-edit-banner',
  templateUrl: './add-edit-banner.component.html',
  styleUrls: ['./add-edit-banner.component.scss']
})
export class AddEditBannerComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];
  @ViewChild('ImageName') imageName: ElementRef;
  public bannerId:any = null;
  public isLoading:boolean = false;
  public fileToUpload: any = null;
  public imageUrl: any = null;

  public formValidations: any = {
    banner_name: [{ type: 'required', message: 'Banner Name is required' }],
    banner_description: [{ type: 'required', message: 'Banner Description is required' }],
    banner_url: [{ type: 'required', message: 'Banner is required' }],
  }
  bannerForm = this.fb.group({
      banner_name:  new FormControl(''),
      banner_description:  new FormControl(''),
      banner_url : new FormControl(''),
      banner_height : new FormControl(''),
      banner_width : new FormControl(''),
    })
  
    constructor(public fb : FormBuilder,
                public bannerService: BannerService,
                public utilService: UtilService,
                public router: Router,
                public route: ActivatedRoute,
                private toastrService: NbToastrService,
              ) { 
                this.route.queryParams.subscribe((params: any) => {
                  if(params.hsn_code_id) {
                    this.bannerId = atob(params.hsn_code_id);
                  }
                  if (this.bannerId) {
                  
                  }
                });
                }

  ngOnInit(): void {
    this.getBannerDetials()
  }

  public getBannerDetials(){

  }

  public handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      //Show image preview
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  public removeImg( ){
    this.imageUrl = '';
    this.imageName.nativeElement.value = '';
  }

  public onSubmit(){
    this.isLoading = true;
    this.bannerForm.markAllAsTouched();
    if (this.bannerForm.invalid) {
      this.isLoading = false;
      // return;
    }
    let payloadObj: any = {};
    payloadObj = this.bannerForm.value
    payloadObj.banner_url = this.fileToUpload
    // console.log(payloadObj,'payloadObj-----');
    if(payloadObj){
      
    }
  }
 public back() {
    this.router.navigateByUrl('/pages/admin-area/marketing/banner-list')
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }

}
