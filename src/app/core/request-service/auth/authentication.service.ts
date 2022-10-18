import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SHA256 } from 'crypto-js';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

declare var require: any;
const __routes: Array<any> = require('../../navigation-options/routes.json');

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationToken: any;
  projectPermissions: any = new Set();
  projectIdList: string[] = [];
  private selectedProject = new BehaviorSubject<any>(null);
  selectedProjectOb$ = this.selectedProject.asObservable();
  private userInfo = new BehaviorSubject<any>(null);
  userInfoOb$ = this.userInfo.asObservable();
  private assignedProjects = new BehaviorSubject<any>([]);
  assignedProjectsOb$ = this.assignedProjects.asObservable();

  public currentProject: Observable<any>;
  public currentProjectSubject!: BehaviorSubject<any>;
  perviousNav: string = '';
  currentNav: string = '';
  navigationOptions: any = [];
  private appRoutes: any[] = __routes;

  constructor(private router: Router) {

    this.authenticationToken = localStorage.getItem('token');
    let currentUserProject = localStorage.getItem('userProjects');
    let selectedProject = localStorage.getItem('selectedProject');
    if (currentUserProject && JSON.parse(currentUserProject) && JSON.parse(currentUserProject)[0]) {
      this.currentProjectSubject = new BehaviorSubject<any>(JSON.parse(currentUserProject)[0]);
      this.selectedProject.next(selectedProject ? JSON.parse(selectedProject) : JSON.parse(currentUserProject)[0]);
      this.assignedProjects.next(JSON.parse(currentUserProject));
      this.setAssignedProjectList(JSON.parse(currentUserProject));
    } else {
      this.currentProjectSubject = new BehaviorSubject<any>([]);
    }

    let userInfo = localStorage.getItem('__UI');
    if (userInfo) {
      this.setUserInfo(JSON.parse(userInfo));
    }

    this.currentProject = this.currentProjectSubject.asObservable();
    this.updateNavigation();
    this.currentNav = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.perviousNav = this.currentNav;
        this.currentNav = event.url;
      };
    });
  }

  updateNavigation() {
    this.navigationOptions = [];
    if (this.projectPermissions && this.projectPermissions.length) {
      this.appRoutes.forEach((route: any) => {
        if (route.permissions.some((ele: any) => this.projectPermissions.indexOf(ele) >= 0)) {
          let { permissions, ...routeData } = route;
          this.navigationOptions.push(routeData)
        }
      })
    }
  }

  validateCredential(eid: any, password: any): { status: boolean, msg: string } {
    return {
      status: eid && eid === password ? false : true,
      msg: 'Password cannot be email Id'
    }
  }

  getHash(text: any) {
    return SHA256(text).toString();
  }

  setUserInfo(userInfo: any) {
    this.userInfo.next(userInfo);
  }

  setAuthenticationToken(authenticationToken: any) {
    this.authenticationToken = authenticationToken;
  }

  public get currentUserValue(): any {
    return this.userInfo.value;
  }

  public get authenticationTokenValue(): any {
    return this.authenticationToken;
  }

  getLoggedInUserInfo() {
    return this.userInfo;
  }

  setAssignedProjectList(projectList: any) {
    this.assignedProjects.next(projectList);
    localStorage.setItem('userProjects', JSON.stringify(projectList));
    this.updatePermissions();
    if (projectList && projectList.length) {
      if (!this.selectedProject.value) {
        this.setUserProject(projectList[0]);
      }
    } else if (projectList.isPatient) {
      // localStorage.setItem('userProjects', JSON.stringify(attributesList.patientPermissionList[0].permissions));
      // this.router.navigate(['./home/application']);
      //   let url = '/home/application';
    } else {
      this.setUserProject(null);
      localStorage.removeItem('userProjects');
      localStorage.removeItem('selectedProject');
      this.router.navigate(['./home']);
    }
  }

  updatePermissions() {
    this.projectPermissions = [];
    this.projectIdList = []

    if (this.assignedProjects.value && this.assignedProjects.value.length) {
      this.assignedProjects.value.forEach((project: any) => {
        this.projectIdList.push(project.projectId);
        this.projectPermissions = new Set([...this.projectPermissions, ...project.permissions]);
      });
      this.projectPermissions = [...this.projectPermissions];

    } else if (this.assignedProjects.value.isPatient) {
      // this.projectPermissions = new Set([...this.projectPermissions, ...(attributesList.patientPermissionList[0].permissions)]);
      this.projectPermissions = [...this.projectPermissions];
    }
    this.updateNavigation();
  }

  getPermissions() {
    return this.projectPermissions;
  }

  setUserProject(selectedProject: any) {
    this.selectedProject.next(selectedProject);
    localStorage.setItem('selectedProject', JSON.stringify(selectedProject))
    this.updatePermissions();
  }

  logout() {
    localStorage.removeItem('userProjects');
    localStorage.removeItem('selectedProject');
    localStorage.removeItem('__UI');
    localStorage.removeItem('token');
    this.assignedProjects.next(null);
    this.selectedProject.next(null);
    this.userInfo.next(null);
    this.router.navigate(['./login']);
  }

  getPreviousNavigation() {
    return this.perviousNav;
  }

  getNavigationOptions() {
    return this.navigationOptions;
  }

}


