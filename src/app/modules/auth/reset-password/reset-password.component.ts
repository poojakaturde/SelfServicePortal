import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { PasswordValidator } from 'src/app/core/services/password.validator';
import { UserDataService } from 'src/app/core/services/user-data-service/user-data.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../auth.style.scss']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, PasswordValidator.strong]),
    confirmpassword: new FormControl('', [Validators.required, PasswordValidator.strong])
  });

  returnUrl: string = "";
  token: string = "";
  userId: any = null;
  showCredentialForm: boolean = false;
  errorMessage: string = "";
  showErrorMsg: boolean = false;

  constructor(private apiServ: RequestApiService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: SnackbarService,
    private authenticationService: AuthenticationService,
    private userDataService: UserDataService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      this.token = queryParams.get("token") || "";
    });
    let userInfo = this.userDataService.getUserInfo();
    if (this.token) {
      this.apiServ.getUserCredential(this.token)
        .subscribe((res:any) => {
          if (res && res.status === 'S') {
            this.userId = res.detail;
            this.showCredentialForm = true;
          } else if (res && res.status === 'E') {
            this.errorMessage = res.description;
            this.showErrorMsg = true;
          }
        }, (error:any) => {
          this.errorMessage = 'Something went wrong ...!';
          this.showErrorMsg = true;
        });
    } else if (userInfo && userInfo.detail) {
      this.userId = userInfo.detail;
      this.showCredentialForm = true;
    } else {
      this.errorMessage = 'Invalid Token ...!';
      this.showErrorMsg = true;
    }
  }


  validatePassword() {
    if (!this.form.value.password) {
      this.snackbar.open('Password cannot be empty', '', { type: 'warning' });
      return false;
    }
    if (!this.form.value.confirmpassword) {
      this.snackbar.open('Confirm Password cannot be empty', '', { type: 'warning' });
      return false;
    }
    if (this.form.value.password != this.form.value.confirmpassword) {
      this.snackbar.open('Passwords do not match !', '', { type: 'warning' });
      return false;
    }
    return true
  }

  onsubmit() {
    if (this.validatePassword()) {
      let reqObj = {
        "userName": this.userId,
        "password": this.authenticationService.getHash(this.form.value.confirmpassword)
      }

      this.apiServ.confirmPassword(reqObj)
        .subscribe((res:any) => {
          if (res) {
            if (res.status === 'S') {
              this.snackbar.open(res.description, '', { type: 'success' });
              this.router.navigate(['./login']);
            } else {
              this.snackbar.open(res.description, '', { type: 'warning' })
            }
          }
        }, (error:any) => {
          this.snackbar.open('Something Went Wrong ...!', '', { type: 'warning' })
        });
    }
  }
}
