import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';

@Component({
  selector: 'app-create-edit-role',
  templateUrl: './create-edit-role.component.html',
  styleUrls: ['./create-edit-role.component.scss']
})
export class CreateEditRoleComponent implements OnInit {

  isCreateRoleOperation: boolean = true;
  roleInfoForm!: FormGroup;
  permissionList = [];
  selectedPermission = [];
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
  }

  createForm() {
    this.roleInfoForm = this.formBuilder.group({
      role: new FormControl({ value: '', disabled: !this.isCreateRoleOperation }, [Validators.required]),
      status: new FormControl('')
    });
  }

  getpermissionList(searchKey: any) {
    return this.permissionList.filter((permission: any) => permission.toLowerCase().includes(searchKey.toLowerCase()))
  }

  removePermission(rmvPermission: any) {
    this.selectedPermission = this.selectedPermission.filter(sPerm => sPerm !== rmvPermission);
  }

  createUpdateRole() {

    if (this.roleInfoForm.status) {
      const reqObj = {
        ...this.selectedRoleData,
        role: this.roleInfoForm.controls['role'].value,
        permissions: [...this.selectedPermission],
        status: this.roleInfoForm.value.status ? 'enabled' : 'disabled',
      }
      // this.apiRequest.createUpdateRole(reqObj, this.isCreateRoleOperation)
      //   .subscribe((res:any) => {
      //     if (res) {
      //       if (res.status === 'S') {
      //         this.router.navigate(['./home/role-management'])
      //       } else if (res.status === 'E' && res.description) {
      //         this.snackbar.open(res.description, '', { type: 'warning' });
      //       }
      //     }
      //   }, (error:any) => {
      //     this.snackbar.open(`Failed to  ${this.isCreateRoleOperation ? 'Created' : 'Updated'} Role`, '', { type: 'warning' });
      //   })
    } else {
      this.snackbar.open(`Please enter all the details before submitting`, '', { type: 'warning' });
    }
  }

}
