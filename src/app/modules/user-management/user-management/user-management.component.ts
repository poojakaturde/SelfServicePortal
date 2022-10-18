import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  public showCards!: boolean;
  displayedColumns = ['name', 'email', 'assignedProjects', 'updated', 'created'];
  dataSource: any = new MatTableDataSource([]);
  isRecordLoaded: boolean = false;
  enabledUserList: any = new MatTableDataSource([]);
  userManagementPermssion = {
    edit: false,
    changeStatus: true,
    create: true
  }

  docStructureIconMap: any = {
    'Structured': 'crop',
    'Semi-Structured': 'list_alt',
    'Free-Form': 'gesture',
    'Medical Chart': 'assignment_ind'
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

  constructor(private apiRequest: RequestApiService,
    private snackbar: SnackbarService,
    private authenticationService: AuthenticationService,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initPermissions()
    this.getUsersList();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
      const value: any = data[sortHeaderId];
      return typeof value === "string" ? value.toLowerCase() : value;
    };
    this.showCards = true;
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  initPermissions() {
    let permission = this.authenticationService.getPermissions();
    let permissions = Array.from(permission)
    this.userManagementPermssion = {
      edit: Array.from(permissions).includes('CREATE_USER') || Array.from(permissions).includes('UPDATE_USER'),
      changeStatus: Array.from(permissions).includes('CREATE_USER') || Array.from(permissions).includes('UPDATE_USER'),
      create: Array.from(permissions).includes('CREATE_USER')
    }
  }

  toggleCardView(value: any) {
    this.showCards = value;
  }

  getUsersList() {
    this.apiRequest.getAllUsers()
      .subscribe((res: any) => {
        this.isRecordLoaded = true;
        if (res && res.detail?.length) {
          res.detail = res.detail.map((user: any) => {
            user.assignedProjects = user.assignedProjects.slice(0, 3)
            return { ...user };
          })
          let activeUsers: any = [];
          this.dataSource.data = res.detail.sort();
          this.dataSource.data = this.dataSource.data.map((x: any) => {
            x.isEnabled = x.status === "enabled" ? true : false
            if (x.isEnabled) {
              activeUsers.push(x);
            }
            return { ...x }
          })
          this.enabledUserList.data = [...activeUsers];
          this.enabledUserList.data = this.enabledUserList.data.sort();
          if (this.userManagementPermssion.edit || this.userManagementPermssion.changeStatus) {
            this.displayedColumns.push('action');
          }
        }

      }, (error: any) => {
        this.isRecordLoaded = true;
        this.snackbar.open('Failed To Fetch the User List ...!', '', { type: 'warning' });
      })
  }


  filterUserTableData(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.data = this.dataSource.data.map((users: any) => {
      // users.created = this.datePipe.transform(users.created, 'MM-dd-yyyy HH:mm:ss');
      // users.updated = this.datePipe.transform(users.updated, 'MM-dd-yyyy HH:mm:ss');
      return { ...users };
    })
    this.dataSource.filterPredicate = function (data: any, filter: any): any {
      return data.name.toLowerCase().includes(filter) || data.email.toLowerCase().includes(filter) ||
        data.created.toLowerCase().includes(filter) || data.updated.toLowerCase().includes(filter) ||
        JSON.stringify(data.assignedProjects).toLowerCase().includes(filter);
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if (this.enabledUserList) {
      this.enabledUserList.data = this.enabledUserList.data.map((user: any) => {
        // user.created = this.datePipe.transform(user.created, 'MM-dd-yyyy HH:mm:ss');
        // user.updated = this.datePipe.transform(user.updated, 'MM-dd-yyyy HH:mm:ss');
        return { ...user };
      })
      this.enabledUserList.filterPredicate = function (data: any, filter: any): any {
        return data.name.toLowerCase().includes(filter) || data.email.toLowerCase().includes(filter) ||
          data.created.toLowerCase().includes(filter) || data.updated.toLowerCase().includes(filter) ||
          JSON.stringify(data.assignedProjects).toLowerCase().includes(filter);
      }
      this.enabledUserList.filter = filterValue.trim().toLowerCase();
    }
  }

}
