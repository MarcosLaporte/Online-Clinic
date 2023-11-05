import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Toast } from 'src/app/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-specialist-not-enabled',
  templateUrl: './specialist-not-enabled.component.html',
  styleUrls: ['./specialist-not-enabled.component.css']
})
export class SpecialistNotEnabledComponent {
	constructor(private auth: AuthService, private router: Router) { }

	checkEnabled() {
		this.auth.isSpecialistEnabled()
			.then((specEnabled) => {
				if (!specEnabled)
					Toast.fire({ icon: 'error', title: 'Oops...', text: 'Your account has not been enabled yet.', background: '#f27474' });
				else
					this.router.navigateByUrl('home');
			});
	}

	signOut() {
		this.auth.signOut()
			.then(() => {
				Toast.fire({ icon: 'success', title: 'Signed out!', background: '#a5dc86' });
				this.router.navigateByUrl('login');
			})
			.catch((error: any) => {
				if (error)
					Toast.fire({ icon: 'warning', title: 'Oops...', text: error.message, background: '#3fc3ee' });
				else
					Toast.fire({ icon: 'error', title: 'Oops...', text: error.message, background: '#f27474' });
			});
	}
}
