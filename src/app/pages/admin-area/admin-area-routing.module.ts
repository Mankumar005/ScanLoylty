import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAreaComponent } from './admin-area.component';

const routes: Routes = [
  {
    path: '',
    component:AdminAreaComponent,
    children: [
      {
        path: 'marketing',
        loadChildren: () => import('../admin-area/marketing/marketing.module')
          .then(m => m.MarketingModule),
      },
      {
        path: 'master',
        loadChildren: () => import('../admin-area/master/master.module')
          .then(m => m.MasterModule),
      },
      {
        path: 'user-management',
        loadChildren: () => import('../admin-area/user-management/user-management.module')
          .then(m => m.UserManagementModule),
      }
    ]
    }
]
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminAreaRoutingModule { }
