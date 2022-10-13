import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SHA256 } from 'crypto-js';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationToken: any;
  private userInfo = new BehaviorSubject<any>(null);
  private selectedProject = new BehaviorSubject<any>(null);
  selectedProjectOb$ = this.selectedProject.asObservable();
  // private userInfo = new BehaviorSubject<any>(null);
  // userInfoOb$ = this.userInfo.asObservable();

  constructor(private router: Router) {
    this.authenticationToken = localStorage.getItem('token');
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

  getPermissions() {

  }

  logout() {
    localStorage.removeItem('userProjects');
    localStorage.removeItem('selectedProject');
    localStorage.removeItem('__st');
    localStorage.removeItem('__UI');
    localStorage.removeItem('projectFilterStatus');
    localStorage.removeItem('token');
    localStorage.removeItem('patientPermission');

    this.userInfo.next(null);
    this.router.navigate(['./login']);

  }
  

}


