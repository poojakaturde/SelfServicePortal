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
      icon: "../../../../assets/Icons_Users.svg",
      route: "/home/user"
    },
    {
      name: "Role",
      icon: "../../../../assets/Icons_Roles.svg",
      route: "/home/role"
    },
    {
      name: "Projects",
      icon: "../../../../assets/Icons_Projects.svg",
      route: "/home/projects"
    },
    {
      name: "Dynamic Form",
      icon: "../../../../assets/Icons_Dynamic_Form.svg",
      route: "/home/dynamic-form"
    },
    {
      name: "Application",
      icon: "../../../../assets/Icons_Application.svg",
      route: "/home/application"
    }
  ];
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigate(selectedOption: any) {
    console.log(selectedOption.route)
    this.router.navigate([selectedOption.route]);
  }

}
