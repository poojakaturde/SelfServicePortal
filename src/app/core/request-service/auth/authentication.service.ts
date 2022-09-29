import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  validateCredential(eid: any, password: any): { status: boolean, msg: string } {
    return {
      status: eid && eid === password ? false : true,
      msg: 'Password cannot be email Id'
    }
  }
}


