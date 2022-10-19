import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../auth.style.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  returnUrl: string = '';

  constructor(private router: Router,private apiServ: RequestApiService,
    private snackbar: SnackbarService) { }

  ngOnInit(): void {
  }

  onsubmit() {

    let reqObj = {
      "userName": this.form.value.email
    }

    this.apiServ.forgotPassword(reqObj)
      .subscribe(res => {
        console.log(res)
        if (res) {
          if (res.status === 'S') {
            this.snackbar.open(res.description, '', { type: 'success' });
            this.router.navigate(['./login']);
          } else if (res.responseCode === 'EX_DI_406') {
            this.snackbar.open(res.description, '', { type: 'warning' })
            this.router.navigate(['./login']);
          } else {
            this.snackbar.open(res.description, '', { type: 'warning' })
          }
        }
      }, error => {
        this.snackbar.open('Something Went Wrong ...!', '', { type: 'warning' })
      });
  }

}
