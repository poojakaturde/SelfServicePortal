import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateEditUserComponent } from './create-edit-user/create-edit-user.component';
import { UserManagementComponent } from './user-management/user-management.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent
  },
  {
    path: 'create-user',
    component: CreateEditUserComponent
  },
  {
    path: 'edit-user/:id',
    component: CreateEditUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
