import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastSuccess, ToastWarning, ToastError, ToastInfo } from 'src/app/environments/environment';
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
		this.auth.checkEmailVerif()
			.then(async userVerified => {
				if (userVerified) {
					this.router.navigateByUrl(this.auth.urlRedirect);
				}
				else
					ToastError.fire({ title: 'Oops...', text: 'Verify your account!' });
			});
	}

	newVerify() {
		this.auth.sendEmailVerif();
		ToastInfo.fire('Email sent!');
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
