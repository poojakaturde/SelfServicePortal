import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.style.scss']
})
export class LoginComponent implements OnInit {

  showPassword = true;

  form: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    otp: new FormControl(''),
  });
  constructor(private authenticationService: AuthenticationService, private snackbar: SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
  }

  submit() {
    const isCredentialValid = this.authenticationService.validateCredential(this.form.value.userName, this.form.value.password);
    if (!isCredentialValid.status) {
      this.snackbar.open(isCredentialValid.msg, '', { type: 'warning' });
      return
    }
    if (this.form.invalid) {
      this.snackbar.open('Please Enter Valid Data ...!', '', { type: 'warning' })
      return;
    }

    if (this.form.valid) {
      const userInfo = JSON.stringify({
        "userName": this.form.value.userName,
        "password": this.form.value.password,
      })

      localStorage.setItem('__UI', userInfo);
      this.router.navigate(['home'])
    }

  }

}
