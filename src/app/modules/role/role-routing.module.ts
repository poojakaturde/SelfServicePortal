import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateEditRoleComponent } from './create-edit-role/create-edit-role.component';
import { RoleComponent } from './role/role.component';

const routes: Routes = [
  {
    path: '',
    component: RoleComponent
  },
  {
    path: 'create-role',
    component: CreateEditRoleComponent
  },
  {
    path: 'edit-role/:id',
    component: CreateEditRoleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
