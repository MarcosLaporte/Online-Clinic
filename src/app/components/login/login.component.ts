import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Loader } from 'src/app/environments/environment';
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
		
		this.auth.signIn(email, password)
			.then(() => {
				Loader.close();
				this.router.navigateByUrl('home');
			})
			.catch((error) => {
				Swal.fire('Oops...', error.message, 'error');
				return;
			});
	}

	async quickFill() {
		this.loginForm.patchValue({
			email: "marcoslaporte2015@gmail.com",
			password: "UTNFRA"
		})

		this.signIn();
	}
}
