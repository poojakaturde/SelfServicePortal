import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  
  public userInfo: any = null;

  constructor() { }

  getUserInfo() {
    return this.userInfo
  }

  setUserInfo(data: any) {
    this.userInfo = data
  }
}
