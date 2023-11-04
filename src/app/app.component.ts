import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { getAuth } from 'firebase/auth';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent {
	title = 'LaboIV_TP2_Laporte';
	protected isLogged: boolean = false;
	protected isAdmin: boolean = false;

	constructor(private router: Router, private auth: AuthService) { }

	ngOnInit() {
		const fireAuth = getAuth();
		fireAuth.onAuthStateChanged(async fireUser => {
			this.isLogged = fireUser !== null;
			const user = await this.auth.getLoggedUser();
			this.isAdmin = user?.role === 'admin';
		});
	}
}
