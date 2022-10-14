import { TestBed } from '@angular/core/testing';

import { ReateProjectInternalCommunicationServiceService } from './reate-project-internal-communication-service.service';

describe('ReateProjectInternalCommunicationServiceService', () => {
  let service: ReateProjectInternalCommunicationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReateProjectInternalCommunicationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
