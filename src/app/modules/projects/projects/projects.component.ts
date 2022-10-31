import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SharedService } from 'src/app/core/services/shared-service/shared.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  providers: [DatePipe]
})

export class ProjectsComponent implements OnInit {
  public showCards: boolean | undefined;
  displayedColumns = ['projectName', 'documentStructure', 'projectLead', 'startDate', 'endDate', 'updated'];
  dataSource: any = new MatTableDataSource([]);
  enabledProjList: any = new MatTableDataSource([]);
  projectManagementPermssion = {
    edit: true,
    changeStatus: true,
    create: true
  }
  docStructureIconMap: any = {
    'Structured': 'crop',
    'Semi-Structured': 'list_alt',
    'Free-Form': 'gesture',
    'Medical Chart': 'assignment_ind'
  }

  isPlatformAdmin: boolean = false;
  userInfoSunscription!: Subscription;
  isRecordLoaded: boolean = false;
  userInfo: any = null;
  currentProjSubscription!: Subscription;

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  constructor(private datePipe: DatePipe, private authenticationService: AuthenticationService, private router: Router,
    private snackbar: SnackbarService, private apiRequest: RequestApiService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.currentProjSubscription = this.authenticationService.selectedProjectOb$
      .subscribe((currentProj: any) => {

        if (currentProj && Object.keys(currentProj).length) {
          this.isPlatformAdmin = currentProj.roles.includes('Platform Admin');
        }
      });
    this.userInfoSunscription = this.authenticationService.userInfoOb$
      .subscribe((userData: any) => {
        this.userInfo = userData;
      });
    this.getCreatedProjects();
    this.showCards = true;
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
    let permissions = Array.from(permission);
    this.projectManagementPermssion = {
      edit: permissions.includes('CREATE_PROJECT') || permissions.includes('UPDATE_PROJECT'),
      changeStatus: permissions.includes('CREATE_PROJECT') || permissions.includes('UPDATE_PROJECT'),
      create: permissions.includes('CREATE_PROJECT')
    }
  }

  getCreatedProjects() {

    this.apiRequest.getAllProjets(this.userInfo.userName, this.isPlatformAdmin)
      .subscribe((response: any) => {

        let documentData: any[] = [];
        for (const property in response.detail) { // response.detail -> response[0].detail
          let placeholderData = response.detail[property]; // response.detail -> response[0].detail
          placeholderData['projectName'] = property;
          documentData.push(placeholderData);
        }
        this.isRecordLoaded = true;
        let activeProj: any = [];
        if (documentData && documentData.length) {
          this.dataSource.data = documentData;
          this.dataSource.data = this.dataSource.data.map((x: any) => {
            x.isEnabled = x.status === "enabled" ? true : false
            if (x.isEnabled) {
              activeProj.push(x);
            }

            return { ...x }
          })
          this.enabledProjList.data = [...activeProj];

          if (this.projectManagementPermssion.edit || this.projectManagementPermssion.changeStatus) {
            this.displayedColumns.push('action');
          }
        }
      }, error => {
        this.isRecordLoaded = true;
        this.snackbar.open('Failed To Get Created Projects ...!', '', { type: 'warning' });
      })
  }

  changeProjectStatus(project: any) {

    const status = project.isEnabled ? 'enabled' : 'disabled';
    this.apiRequest.enableDisableProject(project.projectId, status)
      .subscribe((res: any) => {

        if (res) {
          //  this.snackbar.open(res.description, '', {type: 'success'});
        }
      }, (error: any) => {
        this.snackbar.open('Error In Changing Status Of Project', '', { type: 'warning' });
      })
  }

  editUserInfo(userId: any) {
    this.router.navigate(['./user-management/edit-user', userId]);
  }

  filterUserTableData(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.data = this.dataSource.data.map((x: any) => {
      x.startDate = this.datePipe.transform(x.startDate, 'MM-dd-yyyy');
      x.endDate = this.datePipe.transform(x.endDate, 'MM-dd-yyyy');
      x.updated = this.datePipe.transform(x.updated, 'MM-dd-yyyy HH:mm:ss');
      return { ...x };
    })
    this.dataSource.filterPredicate = function (data: any, filter: any): any {
      return data.projectName.toLowerCase().includes(filter) || data.projectLead.toLowerCase().includes(filter) ||
        data.documentStructure.toLowerCase().includes(filter) || data.updated.toLowerCase().includes(filter) ||
        data.startDate.toLowerCase().includes(filter) || data.endDate.toLowerCase().includes(filter);
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if (this.enabledProjList) {
      this.enabledProjList.filterPredicate = function (data: any, filter: any): any {
        return data.projectName.toLowerCase().includes(filter) || data.projectLead.toLowerCase().includes(filter) ||
          JSON.stringify(data.total).toLowerCase().includes(filter) || JSON.stringify(data.processed).toLowerCase().includes(filter) ||
          JSON.stringify(data.ready).toLowerCase().includes(filter) || JSON.stringify(data.rejected).toLowerCase().includes(filter) ||
          JSON.stringify(data.totalValidationCount).toLowerCase().includes(filter) || data.totalValidationTime.toLowerCase().includes(filter);
      }
      this.enabledProjList.filter = filterValue.trim().toLowerCase();
    }
  }

  toggleCardView(value: any) {
    this.showCards = value;
  }

  ngOnDestroy() {
    if (this.userInfoSunscription) {
      this.userInfoSunscription.unsubscribe();
    }
  }






}

