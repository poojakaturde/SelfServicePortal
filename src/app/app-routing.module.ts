import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardService } from './core/request-service/auth-guard/authguard.service';
import { ForgotPasswordComponent } from './modules/auth/forgot-password/forgot-password.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { SignupComponent } from './modules/auth/signup/signup.component';
import { HomeComponent } from './modules/landing/home/home.component';
import { LandingComponent } from './modules/landing/landing/landing.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'home',
    canActivate: [AuthguardService],
    component: LandingComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthguardService]
      },
      {
        path: 'user',
        loadChildren: () => import('./modules/user-management/user-management.module').then(m => m.UserManagementModule),
        canActivate: [AuthguardService]
      },
      {
        path: 'role',
        loadChildren: () => import('./modules/role/role.module').then(m => m.RoleModule),
        canActivate: [AuthguardService]
      },
      {
        path: 'projects',
        loadChildren: () => import('./modules/projects/projects.module').then(m => m.ProjectsModule),
        canActivate: [AuthguardService]
      },
      {
        path: 'dynamic-form',
        loadChildren: () => import('./modules/dynamic-form/dynamic-form.module').then(m => m.DynamicFormModule),
        canActivate: [AuthguardService]
      },
      {
        path: 'application',
        loadChildren: () => import('./modules/application/application.module').then(m => m.ApplicationModule),
        canActivate: [AuthguardService]
      },
    ]
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
