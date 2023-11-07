import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Loader, Toast } from 'src/app/environments/environment';
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
		Loader.fire()
		const email = this.loginForm.get('email')?.value;
		const password = this.loginForm.get('password')?.value;

		try {
			await this.auth.signInToFirebase(email, password);
			Loader.close();
		} catch (error: any) {
			Toast.fire({ icon: 'error', title: 'Oops...', text: error.message, background: '#f27474' });
		} finally {
			this.router.navigateByUrl(this.auth.RespectiveUrl);
		}
	}

	async quickFill(role: 'patient' | 'specialist' | 'admin') {
		let email = '';
		let password = '';
		switch (role) {
			case 'patient':
				email = 'doufrafovoiprau-5447@yopmail.com';
				password = 'patone';
				break;
			case 'specialist':
				email = 'lettitteiffihou-7765@yopmail.com';
				password = 'specone';
				break;
			case 'admin':
				email = 'marcoslaporte2015@gmail.com';
				password = 'UTNFRA';
				break;
		}

		this.loginForm.patchValue({
			email: email,
			password: password
		})

		this.signIn();
	}
}