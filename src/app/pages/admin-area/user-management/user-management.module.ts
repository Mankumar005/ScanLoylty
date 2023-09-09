import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { SharedModule } from '../../../shared/sharde.module';
import { UserRolesListComponent } from './user-roles-permission/user-roles-list/user-roles-list.component';
import { AddEditUserRolesComponent } from './user-roles-permission/add-edit-user-roles/add-edit-user-roles.component';
import { MenuListComponent } from './menus/menu-list/menu-list.component';
import { AddEditMenuComponent } from './menus/add-edit-menu/add-edit-menu.component';
import { UserRoleRenderComponent } from './user-roles-permission/render-component/user-edit-delete-button';
import { UserManagementListComponent } from './user-roles-management/user-management-list/user-management-list.component';
import { UserManagementRenderComponent } from './user-roles-management/render-component/user-edit-delete-button';
import { AddEditUserManagementComponent } from './user-roles-management/add-edit-user-management/add-edit-user-management.component';

@NgModule({
  declarations: [
    UserManagementComponent,
    UserRolesListComponent,
    AddEditUserRolesComponent,
    MenuListComponent,
    AddEditMenuComponent,
    UserRoleRenderComponent,
    UserManagementRenderComponent,
    AddEditUserManagementComponent,
    UserManagementComponent,
    UserManagementListComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SharedModule
  ]
})
export class UserManagementModule { }
