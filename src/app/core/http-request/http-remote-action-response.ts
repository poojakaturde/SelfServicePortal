export default class HttpRemoteActionResponse {

    private httpResponse: any;
    private skipSuccessValidation: boolean;
    constructor(serverResponse: any, event: any, skipSuccessValidation = false) {
      this.httpResponse = serverResponse;
      this.skipSuccessValidation = skipSuccessValidation;
    }
  
    get isSuccess(): boolean {
      if (this.skipSuccessValidation) {
        return true;
      }
      const condition1 = this.httpResponse && (typeof (this.httpResponse) === 'object' || Array.isArray(this.httpResponse)) ;
      return condition1;
    }
  
    get isError(): boolean {
      return !this.isSuccess;
    }
  
  }
  