import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCompanyBranchRoutingModule } from './common-company-branch-routing.module';
import { CommonCompanyBranchComponent } from './common-company-branch.component';
import { SharedModule } from '../../shared/sharde.module';


@NgModule({
  declarations: [
    CommonCompanyBranchComponent
  ],
  imports: [
    CommonModule,
    CommonCompanyBranchRoutingModule,
    SharedModule
  ],
  exports:[
    CommonCompanyBranchComponent
  ]
})
export class CommonCompanyBranchModule { }
