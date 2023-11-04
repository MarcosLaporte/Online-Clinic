import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Toast } from 'src/app/environments/environment';
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
			.then((userVerified) => {
				if (!userVerified)
					Toast.fire({ icon: 'error', title: 'Oops...', text: 'Verify your account!', background: '#f27474' });
				else
					this.router.navigateByUrl('home');
			});
	}

	newVerify() {
		this.auth.sendEmailVerif();
	}
}
