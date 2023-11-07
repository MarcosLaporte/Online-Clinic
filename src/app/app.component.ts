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

	constructor(private router: Router, private auth: AuthService) {
		this.router.navigateByUrl(auth.RespectiveUrl);
	}
	
	isAdmin() {
		return this.auth.LoggedUser?.role === 'admin';
	}
	
	isNotSpec() {
		return this.auth.LoggedUser?.role !== 'specialist';
	}
}
