import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Toast } from 'src/app/environments/environment';
import { NotLoggedError } from 'src/app/errors/not-logged-error';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-email-verification',
	templateUrl: './email-verification.component.html',
	styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent {
	constructor(private auth: AuthService, private router: Router) { }

	checkVerify() {
		this.auth.isUserVerified()
			.then(async userVerified => {
				if (userVerified){
					const url = await this.auth.getRespectiveUserUrl();
					this.router.navigateByUrl(url);
				}
				else
					Toast.fire({ icon: 'error', title: 'Oops...', text: 'Verify your account!', background: '#f27474' });
			});
	}

	newVerify() {
		this.auth.sendEmailVerif();
	}

	signOut() {
		this.auth.signOut()
			.then(() => {
				Toast.fire({ icon: 'success', title: 'Signed out!', background: '#a5dc86' });
				this.router.navigateByUrl('login');
			})
			.catch((error: any) => {
				if (error instanceof NotLoggedError)
					Toast.fire({ icon: 'warning', title: 'Oops...', text: error.message, background: '#3fc3ee' });
				else
					Toast.fire({ icon: 'error', title: 'Oops...', text: error.message, background: '#f27474' });
			});
	}
}
