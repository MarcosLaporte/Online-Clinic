import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const notPatGuard: CanActivateFn = (route, state) => {
	const user = inject(AuthService).LoggedUser;
  return user !== null && user.role !== 'patient';
};