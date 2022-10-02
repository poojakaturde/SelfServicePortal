import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { CreateEditUserComponent } from './create-edit-user/create-edit-user.component';


@NgModule({
  declarations: [
    UserManagementComponent,
    CreateEditUserComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule
  ]
})
export class UserManagementModule { }
