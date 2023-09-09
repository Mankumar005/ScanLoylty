import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { UserRolesListComponent } from './user-roles-permission/user-roles-list/user-roles-list.component';
import { AddEditUserRolesComponent } from './user-roles-permission/add-edit-user-roles/add-edit-user-roles.component';
import { MenuListComponent } from './menus/menu-list/menu-list.component';
import { AddEditMenuComponent } from './menus/add-edit-menu/add-edit-menu.component';
import { AddEditUserManagementComponent } from './user-roles-management/add-edit-user-management/add-edit-user-management.component';
import { UserManagementListComponent } from './user-roles-management/user-management-list/user-management-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    children: [
      {
        path: 'user-role-list',
        component: UserRolesListComponent,
      },
      {
        path: 'add-edit-user-role',
        component: AddEditUserRolesComponent,
      },
      {
        path: 'menu-list',
        component: MenuListComponent,
      },
       {
        path: 'add',
        component: AddEditMenuComponent,
      },
      {
        path: 'edit',
        component: AddEditMenuComponent,
      },
      {
       path: 'add-edit-user',
       component: AddEditUserManagementComponent,
     },
     {
       path: 'user-list',
       component: UserManagementListComponent,
     }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
