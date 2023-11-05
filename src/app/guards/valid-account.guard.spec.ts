import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { validAccountGuard } from './valid-account.guard';

describe('validAccountGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => validAccountGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
