import { Component } from '@angular/core';
import { AuthenticationService } from './core/request-service/auth/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'self-service-portal';

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {

    window.addEventListener('storage', (event) => {
      if (event.storageArea == localStorage) {
        let token = localStorage.getItem('token');
        if (token == undefined) {
          this.authenticationService.logout();
        }
      }
    });
  }
}
