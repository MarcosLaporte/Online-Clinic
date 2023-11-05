import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const specEnableDeactivateGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
	return inject(AuthService).LoggedUser === null || inject(AuthService).IsUserValid;
};
