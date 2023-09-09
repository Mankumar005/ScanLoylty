import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonCompanyBranchComponent } from './common-company-branch.component';

const routes: Routes = [
  {
    path: '',
    component: CommonCompanyBranchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonCompanyBranchRoutingModule { }
