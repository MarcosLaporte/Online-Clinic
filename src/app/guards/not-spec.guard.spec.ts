import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { notSpecGuard } from './not-spec.guard';

describe('notSpecGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => notSpecGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
