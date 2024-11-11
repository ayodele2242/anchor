import { TestBed } from '@angular/core/testing';

import { SharedcommandService } from './sharedcommand.service';

describe('SharedcommandService', () => {
  let service: SharedcommandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedcommandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
