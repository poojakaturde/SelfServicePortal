import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { PasswordValidator } from 'src/app/core/services/password.validator';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-edit-user',
  templateUrl: './create-edit-user.component.html',
  styleUrls: ['./create-edit-user.component.scss']
})
export class CreateEditUserComponent implements OnInit {

  userInfoForm!: FormGroup;
  userData: any = {
    created: '',
    email: '',
    id: '',
    name: '',
    password: '',
    status: '',
    updated: '',
    isOtpValidationRequired: ''
  };
  isCreateUserOperation: boolean = true;
  hidePassword: boolean = true;
  userInfo: any = null;
  assignedProjects: any = [];
  docStructureIconMap: any = {
    'Structured': 'crop',
    'Semi-Structured': 'list_alt',
    'Free-Form': 'gesture',
    'Medical Chart': 'assignment_ind'
  }
  rolesNames: any = [];
  authorisedProjects: any[] = [];
  passwordSubStr: string = '';
  checkRole: any = null;
  userRole: any = [];

  currentProjSubscription!: Subscription;
  userInfoSunscription!: Subscription;

  constructor(private formBuilder: FormBuilder,
    private apiRequest: RequestApiService,
    private snackbar: SnackbarService,
    private routes: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {
    this.isCreateUserOperation = this.routes.snapshot.params['id'] ? false : true;
    this.createForm();
  }

  ngOnInit(): void {

    this.currentProjSubscription = this.authenticationService.selectedProjectOb$
      .subscribe((currentProj: any) => {
        if (currentProj && Object.keys(currentProj).length) {
          this.userRole = currentProj.roles;
        }
      });

    this.userInfoSunscription = this.authenticationService.userInfoOb$
      .subscribe(userData => {
        this.userInfo = userData;
      });

    let permission = this.authenticationService.getPermissions();
    let permissions = Array.from(permission);
    if (permissions.includes('CREATE_USER') || (permissions.includes('UPDATE_USER') && !this.isCreateUserOperation)) {
      this.getSelectedUserDetails();
      this.fetchCreatedRoles();
      this.fetchEnabledProjects();
    } else {
      this.snackbar.open('User Does Not Have permission', '', { type: 'warning' });
      this.router.navigate(['./home/user']);
    }
  }

  createForm() {
    this.userInfoForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl({ value: '', disabled: !this.isCreateUserOperation }, [Validators.required]),
      status: new FormControl(''),
      isOtpValidationRequired: new FormControl('')
    });
  }

  getSelectedUserDetails() {
    const userId = this.routes.snapshot.params['id'];
    if (userId) {
      this.isCreateUserOperation = false;
      this.userInfoForm.addControl('created', new FormControl({ value: '', disabled: true }));
      this.userInfoForm.addControl('updated', new FormControl({ value: '', disabled: true }));
      this.apiRequest.getUserDetails(userId)
        .subscribe((res: any) => {
          this.userInfoForm.reset();
          if (res) {
            if (res.status === 'S') {
              this.userData = res.detail;
              this.assignedProjects = [...res.detail.assignedProjects];
              let { id, ...userInfoData } = res.detail;
              this.userInfoForm.patchValue({
                ...userInfoData,
                status: userInfoData.status === 'enabled',
              });
              if (this.userRole.includes('Platform Admin')) {
                this.passwordSubStr = userInfoData.password.substring(0, 10);
                this.userInfoForm.addControl('password', new FormControl(this.passwordSubStr, [Validators.required, PasswordValidator.strong]));
              }
            } else {
              this.snackbar.open(res.description, '', { type: 'warning' });
            }
          } else {
            this.snackbar.open('Error In getting User Details', '', { type: 'warning' })
          }
        }, (error: any) => {
          this.snackbar.open('Error In getting User Details', '', { type: 'warning' })
        })
    }
  }

  fetchCreatedRoles() {
    this.apiRequest.fetchRolesByStatus('enabled')
      .subscribe((res: any) => {
        if (res && res.detail && res.detail.length) {
          this.rolesNames = res.detail.map((r: any) => r.role);
        }
      }, (error: any) => {
        this.snackbar.open('Something went wrong ...!', '', { type: 'warning' });
      })
  }

  fetchEnabledProjects() {
    if (this.userInfo && Object.keys(this.userInfo).length) {
      this.apiRequest.getAssignedProject(this.userInfo.userName)
        .subscribe((res: any) => {
          if (res && res.detail && res.detail.length) {
            this.authorisedProjects = res.detail;
          }
        }, (error: any) => {
          this.snackbar.open('Something went wrong ...!', '', { type: 'warning' });
        });
    }
  }

  getRoleList(searchKey: any) {
    return this.rolesNames.filter((permission: string) => permission.toLowerCase().includes(searchKey.toLowerCase()))
  }

  addRole(roleName: string) {
    let data = {
      "project": "",
      "documentStructure": "",
      "role": roleName
    }
    this.assignedProjects.push(data);
  }

  getAuthorisedProjects(searchKey: string) {
    return this.authorisedProjects.filter(proj => proj.project.toLowerCase().includes(searchKey.toLowerCase()))
  }

  addProject(proj: any, i: number) {
    this.assignedProjects[i].project = proj.project;
    this.assignedProjects[i].documentStructure = proj.documentStructure;
  }

  removeTableData(index: number) {
    if (this.userInfoForm.value.status) {
      this.assignedProjects.splice(index, 1);
    }
    else {
      this.snackbar.open('User is disabled', '', { type: 'warning' });
    }
  }

  removeProject(projName: string, index: number) {
    if (this.userInfoForm.value.status) {
      if (this.assignedProjects[index].project === projName) {
        this.assignedProjects[index].project = "";
        this.assignedProjects[index].documentStructure = "";
      }
    } else {
      this.snackbar.open('User is disabled', '', { type: 'warning' });
    }
  }


  createUpdateUser() {
    const isCredentialValid = this.authenticationService.validateCredential(this.userInfoForm.value.email, this.userInfoForm.value.password);
    if (!isCredentialValid.status) {
      this.snackbar.open(isCredentialValid.msg, '', { type: 'warning' });
      return
    }
    for (let i = 0; i < this.assignedProjects.length; i++) {
      if (!this.assignedProjects[i].project) {
        this.snackbar.open('Role cannot have empty project.', '', { type: 'warning' });
        return;
      }
    }
    const projectArr = this.assignedProjects.map((item: any) => {
      return item.project;
    });
    const isDuplicate = projectArr.some((item: any, val: any) => {
      return projectArr.indexOf(item) !== val
    });
    if (isDuplicate) {
      this.snackbar.open('Projects cannot be same', '', { type: 'warning' });
      return;
    }

    if (this.userInfoForm.valid) {
      let password_attr = {}
      if (!this.isCreateUserOperation && this.userRole.includes('Platform Admin')) {
        password_attr = {
          password: this.passwordSubStr !== this.userInfoForm.value.password ? this.authenticationService.getHash(this.userInfoForm.value.password) : this.userData.password
        }
      }
      const reqObj = {
        ...this.userData,
        ...this.userInfoForm.value,
        email: this.userInfoForm.controls['email'].value,
        assignedProjects: [...this.assignedProjects],
        status: this.userInfoForm.value.status ? 'enabled' : 'disabled',
        isOtpValidationRequired: this.userInfoForm.value.isOtpValidationRequired ? true : false,
        ...password_attr
      }
      this.apiRequest.createUpdateUser(reqObj, this.isCreateUserOperation)
        .subscribe((res: any) => {
          if (res) {
            if (res.status === 'S') {
              this.router.navigate(['./home/user-management']);
            } else if (res.status === 'E' && res.description) {
              this.snackbar.open(res.description, '', { type: 'warning' });
            }
          }
        }, (error: any) => {
          this.snackbar.open(`Failed to ${this.isCreateUserOperation ? 'Created' : 'Updated'}`, '', { type: 'warning' });
        })
    } else {
      this.snackbar.open('Please enter all the details before submitting.', '', { type: 'warning' });
    }
  }

  trim(el: any) {
    this.userInfoForm.patchValue({
      name: this.rem(el)
    })
  }
  
  trimEmail(el: any) {
    this.userInfoForm.patchValue({
      email: this.rem(el)
    })
  }

  rem(j: any) {
    return j.value?.
      replace(/(^\s*)|(\s*$)/gi, ""). // removes leading and trailing spaces
      replace(/[ ]{2,}/gi, " "). // replaces multiple spaces with one space 
      replace(/\n +/, "\n")
  }

  ngOnDestroy() {
    this.currentProjSubscription.unsubscribe();
  }

}
