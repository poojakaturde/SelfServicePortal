import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../auth.style.scss']
})
export class SignupComponent implements OnInit {

  showPassword = true;
  returnUrl: string = '';
  form: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private router: Router, private route: ActivatedRoute,
    private snackbar: SnackbarService,
    private authenticationService: AuthenticationService,
    private apiServ: RequestApiService) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || './home/dynamic-form';
    this.routeIfUserAunthicated();
  }

  routeIfUserAunthicated() {
    const useInfo = this.authenticationService.getLoggedInUserInfo().value;
    if (!useInfo && localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      const UI = localStorage.getItem('__UI') || '{}';
      this.authenticationService.setUserInfo({ ...JSON.parse(UI) });
      this.authenticationService.setAuthenticationToken(token);
      this.router.navigate(['./home']);
    } else if (useInfo) {
      this.router.navigate(['./home']);
    }

  }

  submit() {
    const isCredentialValid = this.authenticationService.validateCredential(this.form.value.userName, this.form.value.password);
    if (!isCredentialValid.status) {
      this.snackbar.open(isCredentialValid.msg, '', { type: 'warning' });
      return
    }
    let reqObj = {
      "name": this.form.value.name,
      "userName": this.form.value.userName,
      "password": this.authenticationService.getHash(this.form.value.password),
    }

    this.apiServ.signUp(reqObj).subscribe((res: any) => {
      if (res) {
        if (res.responseCode == 'SU_DE_204') {
          this.snackbar.open(res.description, '', { type: 'success' });
          this.router.navigate(['./login']);
        } else {
          this.snackbar.open(res.description, '', { type: 'warning' });
        }

      }
    }, (error: any) => {
      this.snackbar.open('Something Went Wrong ...!', '', { type: 'warning' })
    });

  }

}
