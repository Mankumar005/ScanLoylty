import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './master.component';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { AddEditCompanyComponent } from './company/add-edit-company/add-edit-company.component';
import { BranchListComponent } from './branch/branch-list/branch-list.component';
import { AddEditBranchComponent } from './branch/add-edit-branch/add-edit-branch.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      {
        path: 'company-list',
        component: CompanyListComponent,
      },
      {
        path: 'add-edit-company',
        component: AddEditCompanyComponent,
      },
      {
        path: 'branch-list',
        component: BranchListComponent,
      },
      {
        path: 'add-edit-branch',
        component: AddEditBranchComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
