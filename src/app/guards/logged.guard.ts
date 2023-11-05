import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const loggedGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).LoggedUser !== null;
};
