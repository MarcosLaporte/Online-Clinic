import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { notEnabledSpecGuard } from './not-enabled-spec.guard';

describe('notEnabledSpecGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => notEnabledSpecGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
