import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';

@Component({
  selector: 'app-view-created-form',
  templateUrl: './preview-dynamic-form.component.html',
  styleUrls: ['./preview-dynamic-form.component.scss']
})
export class PreviewDynamicFormComponent implements OnInit {

  viewFormId: any;
  viewFormData: any;

  constructor(private routes: ActivatedRoute, private apiRequest: RequestApiService, private snackbar: SnackbarService) {

  }

  ngOnInit(): void {
    this.viewFormId = this.routes.snapshot.params['name'];
    if (this.viewFormId) {
      this.apiRequest.getDynamicFormByName(this.viewFormId).subscribe((res: any) => {
        console.log(res)
        if (res && res.detail) {
          this.viewFormData = res.detail;
        }
      }, error => {
        this.snackbar.open('Error In getting Form Details', '', { type: 'warning' })
      })
    }
  }

}
