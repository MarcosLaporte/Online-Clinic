import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { specEnableDeactivateGuard } from './spec-enable-deactivate.guard';

describe('specEnableDeactivateGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => specEnableDeactivateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
