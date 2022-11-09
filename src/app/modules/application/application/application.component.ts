import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
import { ProjectListDialogComponent } from '../project-list-dialog/project-list-dialog.component';
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})

export class ApplicationComponent implements OnInit {
  displayedColumns: string[] = ['projectName', 'formName', 'submittedBy', 'status', 'submittedOn', 'action'];
  dataSource: any = new MatTableDataSource([]);

  FormList: any;
  deleteFormId: any;
  username: any;
  tableFetchedData: any;
  pageSize: any;
  pageIndex: any;
  totalCount: any;
  specific: any;

  tableData: any = {
    name: null,
    status: null,
    projectName: null,
    startDate: null,
    endDate: null,
    by: null,
    page: 0,
    size: 10,
    sortingField: "name",
    sortingOrder: false
  }

  constructor(private apiRequest: RequestApiService, private snackbar: SnackbarService,
    private dialog: MatDialog, private router: Router) {
    const UI = JSON.parse(localStorage.getItem('__UI')!);
    this.username = UI.userName;
    this.fetchTableData();
  }

  ngOnInit(): void {
  }

  // calling api for all submitted forms

  specificuserpatient() {
    if (this.username) {
      this.apiRequest.getPatientForms(this.username).subscribe((res: any) => {
        if (res && res.detail && res.detail.length) {
          this.FormList = res.detail;
          this.dataSource = new MatTableDataSource(this.FormList);
          // this.dataSource.paginator = this.paginator;
        }
      })
    }
    else if (!this.username) {
      this.apiRequest.getAllSubmittedForms().subscribe((res: any) => {
        if (res && res.detail && res.detail.length) {
          this.FormList = res.detail;
          this.dataSource = new MatTableDataSource(this.FormList);
          // this.dataSource.paginator = this.paginator;
        }
      }, error => {
        this.snackbar.open('Failed To Fetch the Form List ..!', '', { type: 'warning' });
      })
    }
  }

  //calling api for deleting Form
  deleteForm(element: any) {
    // this.apiRequest.deleteSubmittedForm(element.id).subscribe((res:any) => {
    //   if (res) {
    //     if (res.status === 'E') {
    //       this.snackbar.open('failed to delete Form', "", { type: 'warning' });
    //     }
    //     else if (res.status === 'S' && res.description) {
    //       this.snackbar.open(res.description, '', { type: 'warning' });
    //     }
    //   }
    //   this.specificuserpatient();
    // })
  }

  // filter for table

  private formatDate(dateObj: any) {
    let givenDate = new Date(dateObj);
    let month = givenDate.getMonth() + 1;
    let days = givenDate.getDate();
    let dateFormat = (month < 10 ? '0' : '') + month + '/' + (days < 10 ? '0' : '') + days + '/' + givenDate.getFullYear();
    return dateFormat;
  }

  searchByFilter(searchFilter: any) {
    const obj = {
      name: this.tableData.name,
      by: this.tableData.by,
      projectName: this.tableData.projectName,
      status: this.tableData.status,
      startDate: this.formatDate(this.tableData.startDate),
      endDate: this.formatDate(this.tableData.endDate),
      page: 0,
      size: 10,
      sortingField: "formName",
      sortingOrder: false,
    }
    this.fetchTableData();
  }

  fetchTableData() {
    this.apiRequest.searchFilter(this.tableData).subscribe((res: any) => {
      if (res && res.detail) {
        this.tableFetchedData = res;
        this.dataSource.data = this.tableFetchedData.detail.submittedForms;
        this.totalCount = this.tableFetchedData.detail.totalDynamicForms;
        this.pageIndex = this.tableFetchedData.detail.currentPage;
      } else {
        this.dataSource.data = [];
        this.totalCount = null;
      }
    })
  }

  pageSizeChange(tableFilter: any) {
    this.tableData.size = tableFilter.pageSize;
    this.tableData.page = tableFilter.pageIndex;
    this.fetchTableData();
    const matTable: any = document.getElementById('matTable');
    matTable.scrollIntoView();
  }

  clearFilter(filterBy: any) {
    filterBy.projectName = '',
      filterBy.name = '',
      filterBy.status = [],
      filterBy.startDate = '',
      filterBy.endDate = '',
      filterBy.by = '',
      filterBy.page = 0,
      filterBy.size = 10,
      filterBy.sortingField = "name",
      filterBy.sortingOrder = true;
  }

  sortData(sort: Sort) {
    this.tableData.sortingField = sort.active;
    if (sort.direction === 'asc') {
      this.tableData.sortingOrder = true;
    }
    else {
      this.tableData.sortingOrder = false;
    }
    this.fetchTableData();
  }

  openDialog() {
    const dialogRef = this.dialog.open(ProjectListDialogComponent, {
      width: '35%'
    },);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.router.navigate(['/home/application/render-form'])
      }
    });
  }
}









