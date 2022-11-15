import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MaterialModule } from '../Material/material.module';
import { HomeComponent } from './home/home.component';
import { LogoutWarningDialogComponent } from './logout-warning-dialog/logout-warning-dialog.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { EditProfileDialogComponent } from './edit-profile-dialog/edit-profile-dialog.component';
@NgModule({
  declarations: [
    LandingComponent,
    HomeComponent,
    LogoutWarningDialogComponent,
    EditProfileDialogComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MaterialModule,
    NgCircleProgressModule.forRoot({
      radius: 50,
      outerStrokeWidth: 6,
      innerStrokeWidth: 2,
      outerStrokeColor: "#e87033",
      innerStrokeColor: "#b3b3b3",
      animationDuration: 0,
      animation: true,
      toFixed: 0,
      backgroundPadding: -10,
      showUnits: true,
      showTitle: true,
      showSubtitle: false
    })

  ]
})
export class LandingModule { }
