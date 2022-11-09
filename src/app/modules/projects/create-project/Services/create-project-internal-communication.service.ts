import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateProjectInternalCommunicationService {

  constructor() { }

  sourceData: Subject<any> = new Subject();
  sourceOb$ = this.sourceData.asObservable();

  UpdateSourcData(data: any) {
    this.sourceData.next(data);
  }
}
