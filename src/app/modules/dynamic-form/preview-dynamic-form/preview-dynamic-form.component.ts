import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';

@Component({
  selector: 'app-preview-dynamic-form',
  templateUrl: './preview-dynamic-form.component.html',
  styleUrls: ['./preview-dynamic-form.component.scss']
})
export class PreviewDynamicFormComponent implements OnInit {

  viewFormName: any;
  viewFormData: any;

  constructor(private routes: ActivatedRoute, private apiRequest: RequestApiService,
    private snackbar: SnackbarService, private router: Router,
    private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    let permission = this.authenticationService.getPermissions();
    let permissions = Array.from(permission);

    if (permissions.includes('VIEW_DYNAMIC_FORM')) {
      this.viewFormName = this.routes.snapshot.params['name'];
      if (this.viewFormName) {
        this.apiRequest.getDynamicFormByName(this.viewFormName).subscribe((res: any) => {
          if (res && res.detail) {
            this.viewFormData = res.detail;
          }
        }, error => {
          this.snackbar.open('Error In getting Form Details', '', { type: 'warning' })
        })
      }
    } else {
      this.snackbar.open('User Does Not Have permission', '', { type: 'warning' });
      this.router.navigate(['./home/dynamic-form']);
    }
  }

}
