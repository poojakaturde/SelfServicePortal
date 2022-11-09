import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';

@Component({
  selector: 'app-project-roles',
  templateUrl: './project-roles.component.html',
  styleUrls: ['./project-roles.component.scss']
})
export class ProjectRolesComponent implements OnInit {

  @Input() step: any;
  @Output() setStep: EventEmitter<any> = new EventEmitter();
  @Input() selectedProjectInfo: any;
  @Input() selectedRoles: any;
  @Input() roleList: any[] = [];
  @Input() userList: any;

  @Output() selectedProjectInfoChange: EventEmitter<any> = new EventEmitter();
  @Output() selectedRolesChange: EventEmitter<any> = new EventEmitter();
  permissionList = [];
  constructor(
    private snackbar: SnackbarService
  ) { }

  ngOnInit(): void {
  }

  showAssignedUsers: boolean[] = [];
  showHideUsers(index: any) {
    this.showAssignedUsers[index] = !this.showAssignedUsers[index];
  }

  removeRole(roleIndex: number, removeUser: string) {
    if (this.selectedProjectInfo.roles[roleIndex].isEnabled) {
      this.selectedProjectInfo.roles[roleIndex].users = this.selectedProjectInfo.roles[roleIndex].users.filter((user: any) => user !== removeUser)
    } else {
      this.snackbar.open(this.selectedProjectInfo.roles[roleIndex].role + ' role is Disabled', '', { type: 'warning' });
    }
    this.selectedProjectInfoChange.emit(this.selectedProjectInfo)
  }

  openUserListDP(userListDP: any, roleIndex: any) {
    if (this.selectedProjectInfo.roles[roleIndex].isEnabled) {
      userListDP.open();
    } else {
      this.snackbar.open(this.selectedProjectInfo.roles[roleIndex].role + ' role is Disabled', '', { type: 'warning' });
    }
    this.selectedProjectInfoChange.emit(this.selectedProjectInfo)
  }
  getUserList(searchKey: any) {
    return this.permissionList.filter((user: any) => user.toLowerCase().includes(searchKey.toLowerCase()))
  }
  addRole(roleName: any) {
    this.selectedRoles.push(roleName);
    this.selectedProjectInfo.roles.push({
      isEnabled: true,
      role: roleName,
      status: "enabled",
      users: []
    })
    this.selectedProjectInfoChange.emit(this.selectedProjectInfo)
    this.selectedRolesChange.emit(this.selectedRoles);
  }

  getpermissionList(searchKey: any) {
    return this.roleList.filter(role => role.toLowerCase().includes(searchKey.toLowerCase()))
  }

}
