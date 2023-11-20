import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { specGuard } from './spec.guard';

describe('specGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => specGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
