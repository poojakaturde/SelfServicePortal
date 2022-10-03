import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateEditDynamicFormComponent } from './create-edit-dynamic-form/create-edit-dynamic-form.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { PreviewDynamicFormComponent } from './preview-dynamic-form/preview-dynamic-form.component';

const routes: Routes = [
  {
    path: '',
    component: DynamicFormComponent
  },
  {
    path: 'create-forms',
    component: CreateEditDynamicFormComponent
  },
  {
    path: 'view-form/:name',
    component: PreviewDynamicFormComponent
  },
  {
    path: 'edit-form/:name',
    component: CreateEditDynamicFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicFormRoutingModule { }
