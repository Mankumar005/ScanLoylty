import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { AuthGuardService } from '../shared/auth-services/auth-guard-service';

const routes: Routes = [{
  path: '',
  component: PagesComponent,canActivate: [AuthGuardService],
  children: [
    {
      path: 'dashboard',
      loadChildren: () => import('./dashboard/dashboard.module')
        .then(m => m.DashboardModule),
    },
    {
      path: 'customer',
      loadChildren: () => import('./customer/customer.module')
        .then(m => m.CustomerModule),
    },
    {
      path: 'transaction',
      loadChildren: () => import('./transaction/transaction.module')
        .then(m => m.TransactionModule),
    },
    {
      path: 'scan',
      loadChildren: () => import('./scan/scan.module')
        .then(m => m.ScanModule),
    },
    {
      path: 'search-customer-transaction',
      loadChildren: () => import('./customer-transaction/customer-transaction.module')
        .then(m => m.CustomerTransactionModule),
    },
    {
      path: 'generate-stamp',
      loadChildren: () => import('./generate-stamp/generate-stamp.module')
        .then(m => m.GenerateStampModule),
    },
    {
      path: 'admin-area',
      loadChildren: () => import('./admin-area/admin-area.module').then( m => m.AdminAreaModule),
    },
    {
      path: 'common',
      loadChildren: () => import('./common-company-branch/common-company-branch.module').then( m => m.CommonCompanyBranchModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
