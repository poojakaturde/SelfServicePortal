import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MaterialModule } from '../Material/material.module';
import { HomeComponent } from './home/home.component';
import { LogoutWarningDialogComponent } from './logout-warning-dialog/logout-warning-dialog.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
@NgModule({
  declarations: [
    LandingComponent,
    HomeComponent,
    LogoutWarningDialogComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MaterialModule,
    NgCircleProgressModule.forRoot({})
  ]
})
export class LandingModule { }
