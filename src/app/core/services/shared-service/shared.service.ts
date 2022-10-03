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
}
