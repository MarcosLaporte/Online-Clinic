import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Loader, ToastError, ToastSuccess, ToastWarning } from 'src/app/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-specialist-not-enabled',
	templateUrl: './specialist-not-enabled.component.html',
	styleUrls: ['./specialist-not-enabled.component.css']
})
export class SpecialistNotEnabledComponent {
	constructor(private auth: AuthService, private router: Router) { }

	checkEnabled() {
		Loader.fire();
		this.auth.isSpecialistEnabled()
			.then((specEnabled) => {
				Loader.close();
				if (!specEnabled)
					ToastError.fire({ title: 'Oops...', text: 'Your account has not been enabled yet.' });
				else
					this.router.navigateByUrl('home');
			});
	}

	signOut() {
		this.auth.signOut()
			.then(() => {
				ToastSuccess.fire({ title: 'Signed out!' });
				this.router.navigateByUrl('login');
			})
			.catch((error: any) => {
				if (error)
					ToastWarning.fire({ title: 'Oops...', text: error.message });
				else
					ToastError.fire({ title: 'Oops...', text: error.message });
			});
	}
}
