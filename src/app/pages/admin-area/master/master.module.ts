import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { MasterComponent } from './master.component';
import { BranchListComponent } from './branch/branch-list/branch-list.component';
import { AddEditBranchComponent } from './branch/add-edit-branch/add-edit-branch.component';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { AddEditCompanyComponent } from './company/add-edit-company/add-edit-company.component';
import { SharedModule } from '../../../shared/sharde.module';
import { BranchRenderComponent } from './branch/render-component/branch-edit-view-button';
import { CompanyRenderComponent } from './company/render-component/company-edit-view-button';

@NgModule({
  declarations: [
    MasterComponent,
    BranchListComponent,
    AddEditBranchComponent,
    BranchRenderComponent,
    CompanyRenderComponent,
    CompanyListComponent,
    AddEditCompanyComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    SharedModule
  ]
})
export class MasterModule { }
