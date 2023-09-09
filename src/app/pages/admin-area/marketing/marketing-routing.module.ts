import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketingComponent } from './marketing.component';
import { BannerListComponent } from './banner-list/banner-list.component';
import { AddEditBannerComponent } from './add-edit-banner/add-edit-banner.component';

const routes: Routes = [
  {
    path: '',
    component: MarketingComponent,
    children: [
      {
        path: 'banner-list',
        component: BannerListComponent
      },
      {
        path: 'add-edit-banner',
        component: AddEditBannerComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }
