import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  displayedColumns = ['name', 'createdBy', 'status', 'created', 'updated'];
  dataSource: any = new MatTableDataSource([]);

  formList: any;
  editFormData: any;
  changedStatus: any;
  pageSize: any;
  pageIndex: any;
  tableFetchedData: any;
  totalCount: any;
  statusList: string[] = ['enabled', 'disabled'];

  tableData: any = {
    name: '',
    status: null,
    startDate: '',
    endDate: '',
    by: '',
    page: 0,
    size: 10,
    sortingField: "name",
    sortingOrder: true,
  }

  dynamicFormPermission = {
    edit: false,
    view: false,
    create: true
  }

  constructor(private apiRequest: RequestApiService, private snackbar: SnackbarService,
    private authenticationService: AuthenticationService,) {
  }

  ngOnInit(): void {
    this.initPermissions();
    this.fetchTableData();
    if (this.dynamicFormPermission.edit || this.dynamicFormPermission.view) {
      this.displayedColumns.push('action');
    }
  }

  initPermissions() {
    let permission = this.authenticationService.getPermissions();
    let permissions = Array.from(permission)
    this.dynamicFormPermission = {
      edit: Array.from(permissions).includes('CREATE_DYNAMIC_FORM') || Array.from(permissions).includes('EDIT_DYNAMIC_FORM'),
      create: Array.from(permissions).includes('CREATE_DYNAMIC_FORM'),
      view: Array.from(permissions).includes('VIEW_DYNAMIC_FORM')
    }
  }

  searchByFilter(searchFilter: any) {
    const obj = {
      name: this.tableData.name,
      status: this.tableData.status,
      startDate: this.formatDate(this.tableData.startDate),
      endDate: this.formatDate(this.tableData.endDate),
      by: this.tableData.by,
      page: 0,
      size: 10,
      sortingField: "name",
      sortingOrder: true,
    }
    this.fetchTableData();
  }

  fetchTableData() {

    this.apiRequest.searchTableData(this.tableData).subscribe((res: any) => {
      if (res && res.detail) {
        this.tableFetchedData = res;
        this.dataSource.data = this.tableFetchedData.detail.dynamicForms;
        this.totalCount = this.tableFetchedData.detail.totalDynamicForms;
        this.pageIndex = this.tableFetchedData.detail.currentPage;
      } else {
        this.dataSource.data = [];
        this.totalCount = null;
      }
    }, error => {
      this.snackbar.open('Failed To Fetch the Filtered Form List ...!', '', { type: 'warning' });
    })

  }

  clearFilter(filterBy: any) {

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

  changeStatus(data: any) {
    if (data.status == 'enabled') {
      this.changedStatus = 'disabled';
    }
    else {
      this.changedStatus = 'enabled';
    }
    // this.apiRequest.deleteDynamicForm(data.id, this.changedStatus).subscribe(res => {
    //   this.getFormList();
    // })

  }

  pageSizeChange(tableFilter: any) {
    this.tableData.size = tableFilter.pageSize;
    this.tableData.page = tableFilter.pageIndex;
    this.fetchTableData();
    const matTable: any = document.getElementById('matTable');
    matTable.scrollIntoView();
  }

  private formatDate(dateObj: any) {
    let givenDate = new Date(dateObj);
    let month = givenDate.getMonth() + 1;
    let days = givenDate.getDate();
    let dateFormat = (month < 10 ? '0' : '') + month + '/' + (days < 10 ? '0' : '') + days + '/' + givenDate.getFullYear();
    return dateFormat;
  }
}
