import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { UserDataService } from 'src/app/core/services/user-data-service/user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.style.scss']
})
export class LoginComponent implements OnInit {

  showPassword = true;
  validateOtpRequest: any;
  checkOTPRecived = false;
  sucssesCodeForOTP: any;
  backupUserId: any;
  returnUrl: string = "";

  form: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    otp: new FormControl(''),
  });
  
  constructor(private authenticationService: AuthenticationService, private snackbar: SnackbarService,
    private router: Router, private apiServ: RequestApiService, private route: ActivatedRoute,
    private userDataService: UserDataService) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || './home/dynamic-form';
    let previousRoute = this.authenticationService.getPreviousNavigation();
    if (previousRoute != '/') {
      window.location.reload();
      return
    }
    this.routeIfUserAunthicated();
  }

  routeIfUserAunthicated() {

    const useInfo = this.authenticationService.getLoggedInUserInfo().value;
    if (!useInfo && localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      const UI = localStorage.getItem('__UI') || '{}';
      this.authenticationService.setUserInfo({ ...JSON.parse(UI) });
      this.authenticationService.setAuthenticationToken(token);
      this.router.navigate(['/home']);
    } else if (useInfo) {
      this.router.navigate(['/home']);
    }
  }

  submit(checkForResendOtp: any) {
    const isCredentialValid = this.authenticationService.validateCredential(this.form.value.userName, this.form.value.password);
    if (!isCredentialValid.status) {
      this.snackbar.open(isCredentialValid.msg, '', { type: 'warning' });
      return
    }
    if (this.form.invalid) {
      this.snackbar.open('Please Enter Valid Data ...!', '', { type: 'warning' })
      return;
    }

    let reqObj = {
      "userName": this.form.value.userName,
      "password": this.authenticationService.getHash(this.form.value.password),
      "otp": this.form.value.otp
    }

    if (this.checkOTPRecived == false || checkForResendOtp == 'resendOtp') {
      this.backupUserId = this.form.value.userName;

      this.apiServ.sendOtpRequest(reqObj)
        .subscribe((res: any) => {
          if (res && res.responseCode == 'SU_DI_200' && res.description == 'Otp sent successfully' && res.description != 'Credential are verified , connect to reset password' && this.checkOTPRecived == false || checkForResendOtp == 'resendOtp') {
            this.sucssesCodeForOTP = res.description;
            this.validateOtpRequest = res.responseCode;
            this.checkOTPRecived = true;
          } else if (res && res.responseCode == 'SU_DI_202' && res.description == 'Credential are verified , connect to reset password') {
            this.userDataService.setUserInfo(res);
            this.router.navigate(['./reset-password']);
          } else if (res && res.responseCode == 'SU_DI_200' && res.description == 'Logged in successfully') {
            if (res.responseCode === 'SU_DI_200') {
              const userInfo = JSON.stringify({
                "userName": res.detail.username,
                "name": res.detail.name,
                "userId": res.detail.id,
                "photo": res.detail.photo,
              })

              localStorage.setItem('token', res.detail.type + ' ' + res.detail.token);
              localStorage.setItem('__UI', userInfo);

              this.authenticationService.setUserInfo({ ...reqObj, name: res.detail.name, userId: res.detail.id, activeTheme: res.detail.activeTheme?.signedUrl, photo: res.detail.photo });
              this.authenticationService.setAuthenticationToken(res.detail.type + ' ' + res.detail.token)
              if (res.detail.isPatient) {
                // localStorage.setItem('userProjects', JSON.stringify(attributesList.patientPermissionList[0]));
                this.authenticationService.setAssignedProjectList(res.detail);
                let url = './home/application';

                this.routeToPermissibleModule(url);
              } else {
                this.getAssignedProjects();
              }
            }
          }
          else {
            this.snackbar.open(res.description, '', { type: 'warning' });
          }
        }, (error: any) => {
          this.snackbar.open('Please check the username or password.', '', { type: 'warning' })
        })
    }

    if (checkForResendOtp != 'resendOtp' && this.validateOtpRequest == 'SU_DI_200') {
      this.apiServ.login(reqObj)
        .subscribe((res: any) => {
          if (res) {
            console.log(res)
            if (res.responseCode === 'SU_DI_200') {
              const userInfo = JSON.stringify({
                "userName": res.detail.username,
                "name": res.detail.name,
                "userId": res.detail.id,
                "photo": res.detail.photo,
              })
              localStorage.setItem('token', res.detail.type + ' ' + res.detail.token);

              localStorage.setItem('__UI', userInfo);
              this.authenticationService.setUserInfo({ ...reqObj, name: res.detail.name, userId: res.detail.id, activeTheme: res.detail.activeTheme?.signedUrl, photo: res.detail.photo });
              this.authenticationService.setAuthenticationToken(res.detail.type + ' ' + res.detail.token);
              if (res.detail.isPatient) {
                // localStorage.setItem('userProjects', JSON.stringify(attributesList.patientPermissionList[0]));
                // this.authenticationService.setAssignedProjectList(res.detail);
                this.getAssignedProjects();
                let url = './home/application';

                this.routeToPermissibleModule(url);
              } else {
                this.getAssignedProjects();
              }

            } else if (res.responseCode === 'SU_DI_202') {
              this.userDataService.setUserInfo(res);
              this.router.navigate(['./reset-password']);
            } else {
              this.snackbar.open(res.description, '', { type: 'warning' });
            }
          } else {
            this.snackbar.open(res.description, '', { type: 'warning' });
          }

        }, (error: any) => {
          this.snackbar.open('Please check the username or password.', '', { type: 'warning' })
        });
    }

  }

  getAssignedProjects() {
    this.apiServ.getAssignedProject(this.form.value.userName)
      .subscribe((res: any) => {
        console.log(res)
        if (res && res.detail && res.detail.length) {
          this.authenticationService.setAssignedProjectList(res.detail);
        }
        let routeLink = res.detail && res.detail.length ? this.returnUrl : '/home';
        this.routeToPermissibleModule(routeLink);

      }, error => {
        this.snackbar.open('Something Went Wrong ...!', '', { type: 'warning' });
      })
  }

  routeToPermissibleModule(routeLink: string) {
    this.router.navigate([routeLink]);
  }

}
