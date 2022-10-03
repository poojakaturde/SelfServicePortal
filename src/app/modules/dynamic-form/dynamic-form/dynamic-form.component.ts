import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  displayedColumns = ['name', 'createdBy', 'status', 'created', 'updated', 'action'];
  dataSource: any = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  formList: any;
  editFormData: any;
  changedStatus: any;
  pageSize: any;
  pageIndex: any;
  totalDocCount: any;
  tableFetchedData: any;
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

  constructor(private router: Router, private apiRequest: RequestApiService, private snackbar: SnackbarService,) {
    this.getFormList();

  }

  ngOnInit(): void {

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

    this.apiRequest.searchTableData(this.tableData).subscribe(res => {
      if (res && res.detail) {
        this.tableFetchedData = res;
        this.dataSource.data = this.tableFetchedData.detail.dynamicForms;
        this.totalDocCount = this.tableFetchedData.detail.totalPages;
        this.pageIndex = this.tableFetchedData.detail.currentPage;
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


  getFormList() {
    this.apiRequest.getDynamicForms()
      .subscribe((res: any) => {
        if (res && res.detail && res.detail.length) {
          this.formList = res.detail;
          this.dataSource = new MatTableDataSource(this.formList);
          this.dataSource.paginator = this.paginator;
        }
      }, error => {
        this.snackbar.open('Failed To Fetch the Form List ...!', '', { type: 'warning' });
      })
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
  }

  private formatDate(dateObj: any) {
    let givenDate = new Date(dateObj);
    let month = givenDate.getMonth() + 1;
    let days = givenDate.getDate();
    let dateFormat = (month < 10 ? '0' : '') + month + '/' + (days < 10 ? '0' : '') + days + '/' + givenDate.getFullYear();
    return dateFormat;
  }
}
