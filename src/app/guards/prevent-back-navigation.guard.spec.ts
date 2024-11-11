import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { preventBackNavigationGuard } from './prevent-back-navigation.guard';

describe('preventBackNavigationGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => preventBackNavigationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
