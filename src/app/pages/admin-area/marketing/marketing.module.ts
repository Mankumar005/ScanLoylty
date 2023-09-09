import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingRoutingModule } from './marketing-routing.module';
import { MarketingComponent } from './marketing.component';
import { SharedModule } from '../../../shared/sharde.module';
import { BannerListComponent } from './banner-list/banner-list.component';
import { AddEditBannerComponent } from './add-edit-banner/add-edit-banner.component';
import { BannerRenderComponent } from './render-component/banner-edit-delete-button';


@NgModule({
  declarations: [
    MarketingComponent,
    BannerListComponent,
    BannerRenderComponent,
    AddEditBannerComponent
  ],
  imports: [
    CommonModule,
    MarketingRoutingModule,
    SharedModule
  ]
})
export class MarketingModule { }
