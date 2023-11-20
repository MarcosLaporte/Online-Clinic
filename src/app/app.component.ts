import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastInfo } from './environments/environment';
import { User } from './classes/user';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent {
	title = 'LaboIV_TP2_Laporte';
	user: User | null = null;
	isValid: boolean = false;
	isEmailVerif: boolean = false;

	constructor(private router: Router, private auth: AuthService) {
		auth.fireUserObs.subscribe(afUser => {
			if (afUser && afUser.emailVerified) {
				this.isValid = true;
				this.isEmailVerif = true;
			}
		});

		auth.loggedUserObs.subscribe(user => {
			this.user = user;
			this.isValid = auth.IsUserValid;
			if (!user) {
				ToastInfo.fire('No user in session.');
				router.navigateByUrl('home');
			}
		});
	}
}
