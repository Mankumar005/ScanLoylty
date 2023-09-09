import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { UtilService } from '../../../shared/common-service/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../shared/common-service/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { GenerateStempService } from '../../../shared/component-services/generate-stemp.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-stamp-details',
  templateUrl: './stamp-details.component.html',
  styleUrls: ['./stamp-details.component.scss']
})
export class StampDetailsComponent implements OnInit, OnDestroy {
    public subscription: Subscription[] = [];
    public generateStampData: any = {};
  
    public stampId: any = "";
  
    public isLoading: boolean = false;
    public isGenerateStampData: boolean = false;
  
    public pageSize: number = 10;
    public currentPage: number = 1;
    public showPerPage: number = 9;
    public totalCount: any;
  
    constructor(
      public utilService: UtilService,
      public generateStampService: GenerateStempService,
      public router: Router,
      public route: ActivatedRoute,
      public commonService: CommonService,
      private toastrService: NbToastrService,
      private dialogService: NbDialogService
    ) {
      this.route.queryParams.subscribe((params: any) => {
        this.stampId = atob(params.stamp_id);
        if (this.stampId) {
  
        }
      });
  
    }
  
    ngOnInit(): void {
      this.getGenerateStampData(this.stampId)
    }
    public getGenerateStampData(id: any) {
      this.subscription.push(this.generateStampService.getGenerateStampDataById(id).subscribe((res: any) => {
        this.isLoading = false;
        this.generateStampData = res.data
        this.generateStampData.created_at = moment.utc(this.generateStampData.created_at).local().format("DD-MM-YYYY hh:mm A");
        // console.log(this.generateStampData, '======this.generateStampData======');
        if (this.generateStampData.stamp_cycle_detail) {
          this.isGenerateStampData = true;
        }
  
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
    public ngOnDestroy() {
      this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
    }
  }
