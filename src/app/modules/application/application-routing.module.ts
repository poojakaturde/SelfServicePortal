import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './application/application.component';
import { FormRenderSubmissionComponent } from './form-render-submission/form-render-submission.component';
import { ViewFormComponent } from './view-form/view-form.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent
  },
  {
    path: 'view-form/:id',
    component: ViewFormComponent
  },
  {
    path: 'render-form',
    component: FormRenderSubmissionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }
