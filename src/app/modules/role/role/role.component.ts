import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit {

  displayedColumns = ['role', 'permissions', 'updated', 'created'];
  dataSource: any = new MatTableDataSource([]);
  userRoles: any;
  isRecordLoaded: boolean = false;

  roleManagementPermssion = {
    edit: true,
    changeStatus: true,
    create: true
  }

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor(private snackbar: SnackbarService, private authenticationService: AuthenticationService,
    private apiRequest: RequestApiService, private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initPermissions();
    this.getAllCreatedRoles();
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
      const value: any = data[sortHeaderId];
      return typeof value === "string" ? value.toLowerCase() : value;
    };
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  initPermissions() {
    let permission = this.authenticationService.getPermissions();
    let permissions = Array.from(permission)
    this.roleManagementPermssion = {
      edit: permissions.includes('CREATE_ROLE') || permissions.includes('UPDATE_ROLE'),
      changeStatus: permissions.includes('CREATE_ROLE') || permissions.includes('UPDATE_ROLE'),
      create: permissions.includes('CREATE_ROLE')
    }
  }

  getAllCreatedRoles() {
    this.apiRequest.fetchCreatedRoles()
      .subscribe((res: any) => {
        this.isRecordLoaded = true;
        if (res && res.detail && res.detail.length) {
          res.detail = res.detail.map((role: any) => {
            role.isEnabled = role.status === "enabled" ? true : false
            return { ...role };
          });
          this.dataSource.data = res.detail.sort();
          if (this.roleManagementPermssion.edit || this.roleManagementPermssion.changeStatus) {
            this.displayedColumns.push('action');
          }
        }
      }, (error: any) => {
        this.isRecordLoaded = true;
        this.snackbar.open('Failed To Fetch the Role List ...!', '', { type: 'warning' });
      })
  }

  filterUserTableData(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.data = this.dataSource.data.map((role: any) => {
      // role.created = this.datePipe.transform(role.created, 'MM-dd-yyyy HH:mm:ss');
      // role.updated = this.datePipe.transform(role.updated, 'MM-dd-yyyy HH:mm:ss');
      return { ...role };
    })
    this.dataSource.filterPredicate = function (data: any, filter: any): any {
      return JSON.stringify(data.permissions).toLowerCase().indexOf(filter) !== -1 || data.role.toLowerCase().includes(filter) ||
        data.created.toLowerCase().includes(filter) || data.updated.toLowerCase().includes(filter);
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  pageSizeChange() {
    const matTable: any = document.getElementById('matTable');
    matTable.scrollIntoView();
  }
}
