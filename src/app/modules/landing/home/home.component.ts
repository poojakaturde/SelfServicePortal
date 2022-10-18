import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userAccess: any = [
    {
      name: "Users",
      icon: "../../../../assets/icons/Icons_Users.svg",
      route: "/home/user"
    },
    {
      name: "Role",
      icon: "../../../../assets/icons/Icons_Roles.svg",
      route: "/home/role"
    },
    {
      name: "Projects",
      icon: "../../../../assets/icons/Icons_Projects.svg",
      route: "/home/projects"
    },
    {
      name: "Dynamic Form",
      icon: "../../../../assets/icons/Icons_Dynamic_Form.svg",
      route: "/home/dynamic-form"
    },
    {
      name: "Application",
      icon: "../../../../assets/icons/Icons_Application.svg",
      route: "/home/application"
    }
  ];
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigate(selectedOption: any) {
 
    this.router.navigate([selectedOption.route]);
  }

}
