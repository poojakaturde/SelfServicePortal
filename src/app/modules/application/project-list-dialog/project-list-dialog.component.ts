import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SharedService } from 'src/app/core/services/shared-service/shared.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';

@Component({
  selector: 'app-project-list-dialog',
  templateUrl: './project-list-dialog.component.html',
  styleUrls: ['./project-list-dialog.component.scss']
})
export class ProjectListDialogComponent implements OnInit {

  username: any;
  projectsList: any;
  formName: any;
  filteredOptions: any;
  options: any[] = [];
  myControl: FormControl = new FormControl();

  constructor(private service: SharedService) {
    const userProjects = JSON.parse(localStorage.getItem('userProjects'));
    this.projectsList = userProjects;
  }

  ngOnInit(): void {
    this.initForm();
  }

  selected(e: any) {
    for (var projects of this.projectsList) {
      if (projects.project == e.option.value) {
        this.formName = projects.selfServiceForm;
      }
    }
    this.service.sendFormName(this.formName, e.option.value);
  }

  initForm() {
    this.myControl.valueChanges
      .pipe()
      .subscribe(response => {
        if (response) {
          this.filterData(response);
        } else {
          this.filteredOptions = this.options;
        }
      })
  }

  filterData(enteredData: string) {
    this.filteredOptions = this.options.filter((item: any) => {
      return item.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }

}
