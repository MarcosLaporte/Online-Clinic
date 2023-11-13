import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastInfo } from './environments/environment';
import { Specialist } from './classes/specialist';
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
			if (user) {
				if (user.role === 'specialist' && !((user as Specialist).isEnabled))
					this.isValid = false;
			} else {
				ToastInfo.fire('No user in session.');
				router.navigateByUrl('home');
			}
		});
	}
}
