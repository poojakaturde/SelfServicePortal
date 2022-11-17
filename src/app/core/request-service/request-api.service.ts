import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestApiService {

  public url = "http://ssp.neutrino-ai.com/ssp";
  constructor(private http: HttpClient) { }

  sendOtpRequest(reqObj: any) {
    return this.http.post<any>(this.url + "/api/auth/login", reqObj)
  }

  login(reqObj: any) {
    return this.http.post<any>(this.url + "/api/auth/validateOtp", reqObj)
  }

  logout() {
    return this.http.get(this.url + "/sign-out")
  }

  signUp(reqObj: any) {
    return this.http.post<any>(this.url + "/sign-up", reqObj)
  }

  forgotPassword(reqObj: any) {
    return this.http.post<any>(this.url + "/forgotpassword", reqObj)
  }

  getUserCredential(token: any) {
    return this.http.get(this.url + "/validateuser?token=" + token)
  }

  confirmPassword(reqObj: any) {
    return this.http.post<any>(this.url + "/confirmpassword", reqObj)
  }

  //  ----------------------- API SERVICES FOR Dynamic Forms Creation -------------------------- //

  createUpdateDynamicForm(obj: any, isCreateDynamicFormOperation: boolean) {
    if (isCreateDynamicFormOperation) {
      return this.http.post<any>(this.url + "/dynamicform", obj)
    }
    else {
      return this.http.patch<any>(this.url + "/dynamicform", obj)
    }
  }

  getDynamicForms() {
    return this.http.get(this.url + "/dynamicform")
  }

  getDynamicFormByName(formName: string) {
    return this.http.get(this.url + "/dynamicform/get?formName=" + formName)
  }

  searchTableData(obj: any) {
    return this.http.post<any>(this.url + "/dynamicform/search_criteria?landingPage=dynamicForm", obj)
  }

  getOperatorList() {
    return this.http.get(this.url + "/config/validationTypeDetails")
  }

  //  ---------------------------- API SERVICES FOR APPLICATION ---------------------------------//

  getSSPEnabledProjects(username: any) {
    return this.http.get(this.url + '/activeprojectdetails/' + username + '?isSelfServiceEnabled=true')
  }

  getAllSubmittedForms() {
    return this.http.get(this.url + "/dynamicform/submit/getAll")
  }

  getPatientForms(email: any) {
    return this.http.get(this.url + "/dynamicform/submit?email=" + email)
  }

  getSubmittedFormById(formId: any) {
    return this.http.get(this.url + "/dynamicform/submit/get?formId=" + formId)
  }

  renderFormByName(formName: any) {
    return this.http.get(this.url + "/dynamicform/get?formName=" + formName)
  }

  submitUserForm(formName: any, obj: any, projectName: any, userName: any) {
    return this.http.post<any>(this.url + '/dynamicform/submit?email=' + userName + '&dynamicFormName=' + formName + '&projectName=' + projectName, obj)
  }

  searchFilter(obj: any) {
    return this.http.post(this.url + "/dynamicform/search_criteria?landingPage=submittedForm", obj)
  }


  //  -------------------------------- API SERVICES FOR ROLES ---------------------------------//

  fetchCreatedRoles() {
    return this.http.get(this.url + "/role")
  }

  fetchRolesByStatus(status: string) {
    return this.http.get(this.url + "/role/" + status)
  }

  getRoleDetails(id: any) {
    return this.http.get(this.url + "/role/id/" + id)
  }

  createUpdateRole(reqObj: any, isCreateOperation: boolean) {
    if (isCreateOperation) {
      return this.http.post<any>(this.url + "/role", reqObj)
    }
    else {
      return this.http.patch<any>(this.url + "/role", reqObj)
    }
  }

  //  -------------------------------- API SERVICES FOR USERS ---------------------------------//

  getAllUsers() {
    return this.http.get(this.url + "/admin/user")
  }

  getUserDetails(userId: any) {
    return this.http.get(this.url + "/admin/user/id/" + userId)
  }

  createUpdateUser(reqObj: any, isCreateOperation: boolean) {
    if (isCreateOperation) {
      return this.http.post<any>(this.url + "/admin/user", reqObj)
    }
    else {
      return this.http.patch<any>(this.url + "/admin/user", reqObj)
    }
  }

  getAssignedProject(userName: any) {
    return this.http.get(this.url + "/activeprojectdetails/" + userName)
  }

  //  -------------------------------- API SERVICES FOR PROJECT ---------------------------------//

  getAllProjets(userName: any, userRole?: any) {
    if (userRole) {
      return this.http.get(this.url + '/admin/project/projectLandingPage')
    }
    else {
      return this.http.get(this.url + '/admin/project/projectLandingPage?userName=' + userName)
    }
  }

  enableDisableProject(projectId: any, status: any) {
    return this.http.get(this.url + '/admin/project/status/' + projectId + '/' + status)
  }

  //==================================API SERVICE FOR CREATE-PROJECT==============================

  fetchRolesByStatuss(status: any) {
    return this.http.get(this.url + '/role/' + status)
  }

  getDatsetList() {
    return this.http.get(this.url + '/dataset/list/activeDatasets')
  }

  getProjectDetails(id: any) {
    return this.http.get(this.url + '/admin/project/id/' + id)
  }

  getUsersByStatus(status: any) {
    return this.http.get(this.url + '/admin/user/' + status)
  }

  getTemplatesList() {
    return this.http.get(this.url + '/template/activeTemplateList')
  }

  createUpdateProject(reqObj: any, isCreateOperation: any) {
    if (isCreateOperation) {
      return this.http.post(this.url + '/admin/project', reqObj)
    }
    else {
      return this.http.patch(this.url + '/admin/project', reqObj)
    }
  }

  getDynamicFormList() {
    return this.http.get(this.url + '/dynamicform/enabled')
  }


  //  -------------------------------- API SERVICES FOR PERMISSIONS ---------------------------------//

  fetchPermissionList() {
    return this.http.get(this.url + "/permission")
  }

  getSourceList() {
    return this.http.get(this.url + "/channel/src")
  }

  testSourceConnection(channel: any, obj: any) {
    return this.http.get(this.url + "/channel/" + channel, obj)
  }

  testSourceConnection1(channel: any, obj: any, file: any) {

    const fd = new FormData();
    fd.append('multipartFile', file, file.name);
    fd.append('gdriveModel', new Blob([
      JSON.stringify(
        obj
      )], {
      type: "application/json"
    }));

    return this.http.post(this.url + "/channel/" + channel, fd)
  }

  testTargetChannelConnection(reqObj: any) {
    return this.http.post(this.url + '/api/data/testTargetChannelConnection', reqObj)
  }

  uploadProfilePicture(userId: any, fileToUpload?: File) {
    const fd = new FormData();
    fd.append('photo', fileToUpload);
    return this.http.post(this.url + '/admin/user/photo/' + userId, fd)
  }
  
}
