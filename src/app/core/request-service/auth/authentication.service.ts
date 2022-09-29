import { Injectable } from '@angular/core';
import { SHA256 } from 'crypto-js';

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

  getHash(text: any) {
    return SHA256(text).toString();
  }
}


