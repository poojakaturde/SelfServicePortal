import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userAccess: any = [];
  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.userAccess = this.authenticationService.getNavigationOptions() || [];
  }

  navigate(selectedOption: any) {

    this.router.navigate([selectedOption.route]);
  }

}
