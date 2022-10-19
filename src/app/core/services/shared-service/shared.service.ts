import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  SSPEnabledFormName: any;
  projectName: any;

  constructor() { }

  sendFormName(data: any, e: any) {
    this.SSPEnabledFormName = data;
    this.projectName = e;
  }

  getFormName() {
    return this.SSPEnabledFormName;
  }

  getProjectName() {
    return this.projectName;
  }

  compare(a: any, b: any) {
    if (a.updated > b.updated) {
      return -1;
    }
    if (a.updated < b.updated) {
      return 1;
    }
    return 0;
  }
}
