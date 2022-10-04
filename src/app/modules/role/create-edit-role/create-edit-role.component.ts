import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
import * as _ from "lodash";
@Component({
  selector: 'app-create-edit-role',
  templateUrl: './create-edit-role.component.html',
  styleUrls: ['./create-edit-role.component.scss']
})
export class CreateEditRoleComponent implements OnInit {

  isCreateRoleOperation: boolean = true;
  permissionWithDesc: any = null;
  iscreateUpdateBtnClicked: boolean = false;
  roleInfoForm!: FormGroup;
  permissionList = [];
  selectedPermission: any = [];
  selectedCategory: any = "";
  categoryNode: any[] = [];
  permisionListCopy: any = [];
  selectedRoleData: any = {
    created: '',
    permissions: [],
    role: '',
    status: '',
    updated: ''
  };

  constructor(private formBuilder: FormBuilder,
    private apiRequest: RequestApiService,
    private snackbar: SnackbarService,
    private routes: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {
    this.isCreateRoleOperation = this.routes.snapshot.params['id'] ? false : true;
  }

  ngOnInit(): void {
    let permissions = this.authenticationService.getPermissions();
    if (this.isCreateRoleOperation) {
      this.fetchAllPermission();
      this.createForm();
      const roleId = this.routes.snapshot.params['id'];
      if (roleId) {
        this.roleInfoForm.addControl('created', new FormControl({ value: '', disabled: true }));
        this.roleInfoForm.addControl('updated', new FormControl({ value: '', disabled: true }));
        this.isCreateRoleOperation = false;
        this.apiRequest.getRoleDetails(roleId)
          .subscribe((res: any) => {
            if (res && res.detail) {
              this.selectedRoleData = res.detail;
              this.selectedPermission = [...res.detail.permissions];
              this.roleInfoForm.setValue({

                role: res.detail.role,
                created: res.detail.created,
                updated: res.detail.updated,
                status: res.detail.status === 'enabled'
              });
            }

          }, (error: any) => {
            this.snackbar.open('Error In getting User Details', '', { type: 'warning' })
          })
      }
    } else {
      this.snackbar.open('User Does Not Have permission', '', { type: 'warning' });
      this.router.navigate(['./home/role-management']);
    }
  }

  fetchAllPermission() {
    this.apiRequest.fetchPermissionList()
      .subscribe((res: any) => {
        if (res && res.detail) {
          this.permissionWithDesc = res.detail;
          let permissionGroup: any = {};
          let userNode: any = []
          res.detail.forEach((element: any) => {
            if (permissionGroup.hasOwnProperty(element.type)) {
              permissionGroup[element.type].push(element.displayName);
            } else {
              permissionGroup[element.type] = [element.displayName];
            }
            userNode.push(element.type)
          });
          this.categoryNode = [...userNode]
          this.categoryNode = _.union(this.categoryNode)
          Object.values(permissionGroup).forEach((val: any) => {
            this.permisionListCopy = [...this.permisionListCopy, ...val]
          });
        }
      }, (error: any) => {
        this.snackbar.open('Something went wrong ...!', '', { type: 'warning' });
      })
  }

  selectUsers($event: any, dataset: any) {
    $event.stopPropagation();
    $event.preventDefault();
    if (this.selectedPermission.includes(dataset.displayName)) {
      this.selectedPermission = this.selectedPermission.filter((sPerm: any) => sPerm !== dataset.displayName);
    }
    else this.selectedPermission.push(dataset.displayName)
  }

  createForm() {
    this.roleInfoForm = this.formBuilder.group({
      role: new FormControl({ value: '', disabled: !this.isCreateRoleOperation }, [Validators.required]),
      status: new FormControl('')
    });
  }

  getcategoryList(searchKey: any) {
    return this.categoryNode.filter((category: any) => category.toLowerCase().includes(searchKey.toLowerCase()))
  }

  getpermissionList(searchKey: any) {
    return this.permissionList.filter((permission: any) => permission.toLowerCase().includes(searchKey.toLowerCase()))
  }

  removePermission(rmvPermission: any) {
    this.selectedPermission = this.selectedPermission.filter((sPerm: any) => sPerm !== rmvPermission);
  }

  createUpdateRole() {

    if (this.roleInfoForm.status) {
      const reqObj = {
        ...this.selectedRoleData,
        role: this.roleInfoForm.controls['role'].value,
        permissions: [...this.selectedPermission],
        status: this.roleInfoForm.value.status ? 'enabled' : 'disabled',
      }
      this.apiRequest.createUpdateRole(reqObj, this.isCreateRoleOperation)
        .subscribe((res: any) => {
          if (res) {
            if (res.status === 'S') {
              this.router.navigate(['./home/role-management'])
            } else if (res.status === 'E' && res.description) {
              this.snackbar.open(res.description, '', { type: 'warning' });
            }
          }
        }, (error: any) => {
          this.snackbar.open(`Failed to  ${this.isCreateRoleOperation ? 'Created' : 'Updated'} Role`, '', { type: 'warning' });
        })
    } else {
      this.snackbar.open(`Please enter all the details before submitting`, '', { type: 'warning' });
    }
  }

  trim(el: any) {
    this.roleInfoForm.patchValue({
      role: this.rem(el)
    })
  }
  rem(j: any) {
    return j.value?.
      replace(/(^\s*)|(\s*$)/gi, ""). // removes leading and trailing spaces
      replace(/[ ]{2,}/gi, " "). // replaces multiple spaces with one space 
      replace(/\n +/, "\n").
      replace()
  }

}
