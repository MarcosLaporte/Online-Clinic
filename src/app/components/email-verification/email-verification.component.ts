import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastSuccess, ToastWarning, ToastError } from 'src/app/environments/environment';
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
				if (userVerified) {
					const url = await this.auth.getRespectiveUserUrl();
					this.router.navigateByUrl(url);
				}
				else
					ToastError.fire({ title: 'Oops...', text: 'Verify your account!' });
			});
	}

	newVerify() {
		this.auth.sendEmailVerif();
	}

	signOut() {
		this.auth.signOut()
			.then(() => {
				ToastSuccess.fire({ title: 'Signed out!' });
				this.router.navigateByUrl('login');
			})
			.catch((error: any) => {
				if (error instanceof NotLoggedError)
					ToastWarning.fire({ title: 'Oops...', text: error.message });
				else
					ToastError.fire({ title: 'Oops...', text: error.message });
			});
	}
}
