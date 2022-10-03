import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-form',
  templateUrl: './view-form.component.html',
  styleUrls: ['./view-form.component.scss']
})
export class ViewFormComponent implements OnInit {
  id: any;
  viewFormData: any;
  constructor(private routes: ActivatedRoute, private http: HttpClient, private apiRequst: RequestApiService, private snackbar: SnackbarService) {
  }

  ngOnInit(): void {
    this.id = this.routes.snapshot.params['id'];
    this.getViewFormData();
  }

  getViewFormData() {
    this.apiRequst.getSubmittedFormById(this.id).subscribe((res: any) => {
      if (res && res.detail) {
        this.viewFormData = res.detail;
      }
    }, error => {
      this.snackbar.open('Failed To Fetch the Form List ...!', '', { type: 'warning' });
    })
  }
}
