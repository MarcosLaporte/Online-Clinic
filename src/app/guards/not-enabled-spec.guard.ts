import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Specialist } from '../classes/specialist';

export const notEnabledSpecGuard: CanActivateFn = (route, state) => {
	const user = inject(AuthService).LoggedUser as Specialist;
  return !user.isEnabled;
};
