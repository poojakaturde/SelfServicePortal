import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../Material/material.module';
import { RoleRoutingModule } from './role-routing.module';
import { RoleComponent } from './role/role.component';
import { CreateEditRoleComponent } from './create-edit-role/create-edit-role.component';


@NgModule({
  declarations: [
    RoleComponent,
    CreateEditRoleComponent
  ],
  imports: [
    CommonModule,
    RoleRoutingModule,
    MaterialModule
  ]
})
export class RoleModule { }
