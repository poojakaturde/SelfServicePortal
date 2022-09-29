import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
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
    private authenticationService: AuthenticationService,) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || './home/dynamic-form';
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

    // this.apiServ.signUp(reqObj).subscribe(res => {
    //   if (res) {
    //     if (res.responseCode == 'SU_DE_204') {
    //       this.snackbar.open(res.description, '', { type: 'success' });
    //       this.router.navigate(['./login']);
    //     } else {
    //       this.snackbar.open(res.description, '', { type: 'warning' });
    //     }

    //   }
    // }, error => {
    //   this.snackbar.open('Something Went Wrong ...!', '', { type: 'warning' })
    // });

  }

}
