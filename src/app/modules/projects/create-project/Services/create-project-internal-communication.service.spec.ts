import { TestBed } from '@angular/core/testing';

import { CreateProjectInternalCommunicationService } from './create-project-internal-communication.service';

describe('CreateProjectInternalCommunicationService', () => {
  let service: CreateProjectInternalCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateProjectInternalCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
