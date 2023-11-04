import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Loader, Toast } from 'src/app/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {
	loginForm: FormGroup;

	constructor(private router: Router, private auth: AuthService, private fb: FormBuilder) {
		this.loginForm = fb.group({
			email: [
				'',
				[
					Validators.required,
					Validators.email,
				]
			],
			password: [
				'',
				[
					Validators.required,
				]
			]
		});
	}

	signIn() {
		Loader.fire()
		const email = this.loginForm.get('email')?.value;
		const password = this.loginForm.get('password')?.value;

		this.auth.signInToFirebase(email, password)
			.then(async () => {
				Loader.close();
				try {
					if (!(await this.auth.isUserVerified())) throw new Error("Verify your account!");
				} catch (error: any) {
					Toast.fire({ icon: 'error', title: 'Oops...', text: error.message, background: '#f27474' })
					if (error.message == 'Verify your account!')
						this.router.navigateByUrl('account-verification');

					return;
				}
				this.router.navigateByUrl('home');
			})
			.catch((error) => Swal.fire('Oops...', error.message, 'error'));
	}

	async quickFill() {
		this.loginForm.patchValue({
			email: "marcoslaporte2015@gmail.com",
			password: "UTNFRA"
		})

		this.signIn();
	}
}