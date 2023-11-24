import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { notPatGuard } from './not-pat.guard';

describe('notPatGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => notPatGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
