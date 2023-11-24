import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/classes/user';
import { Loader } from 'src/app/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {
	loginForm: FormGroup;
	protected users: Array<User> = [];

	constructor(private router: Router, private auth: AuthService, private db: DatabaseService, private fb: FormBuilder) {
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

	async ngOnInit() {
		Loader.fire();
		this.users = await this.db.getData<User>('users');
		Loader.close();
	}

	async signIn() {
		Loader.fire();
		const email = this.loginForm.get('email')?.value;
		const password = this.loginForm.get('password')?.value;

		await this.auth.signInToFirebase(email, password)
			.catch(() => { });

		this.router.navigateByUrl(this.auth.urlRedirect);
		Loader.close();
	}

	quickFill(user: User) {
		this.loginForm.patchValue({
			email: user.email,
			password: user.password
		})

		this.signIn();
	}
}