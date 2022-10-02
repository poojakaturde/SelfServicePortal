import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(private router: Router,
    private authenticationService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const tokenValue = this.authenticationService.authenticationTokenValue;
    if (tokenValue) {

      if (state.url === '/home') {
        return true
      }

      return this.router.navigate(['/home']);

    }
    this.router.navigate(['/login']);
    return false;
  }
}
