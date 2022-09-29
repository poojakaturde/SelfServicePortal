import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application/application.component';
import { FormRenderSubmissionComponent } from './form-render-submission/form-render-submission.component';
import { ViewFormComponent } from './view-form/view-form.component';


@NgModule({
  declarations: [
    ApplicationComponent,
    FormRenderSubmissionComponent,
    ViewFormComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule
  ]
})
export class ApplicationModule { }
