import { TestBed } from '@angular/core/testing';

import { SharedsignalService } from './sharedsignal.service';

describe('SharedsignalService', () => {
  let service: SharedsignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedsignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
