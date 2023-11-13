import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Loader, ToastError } from 'src/app/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

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

	async signIn() {
		Loader.fire();
		const email = this.loginForm.get('email')?.value;
		const password = this.loginForm.get('password')?.value;

		await this.auth.signInToFirebase(email, password)
			.catch((error: any) => ToastError.fire({ title: 'Oops...', text: error.message }));

		this.router.navigateByUrl(this.auth.urlRedirect);
		Loader.close();
	}

	quickFill(role: 'patient' | 'specialist' | 'admin') {
		let email: string;

		switch (role) {
			case 'patient':
				email = 'wummauwubritou-6588@yopmail.com';
				break;
			case 'specialist':
				email = 'xaprobraugreprei-7355@yopmail.com';
				break;
			case 'admin':
				email = 'marcoslaporte2015@gmail.com';
				break;
		}

		this.loginForm.patchValue({
			email: email,
			password: 'utnfra'
		})

		this.signIn();
	}
}