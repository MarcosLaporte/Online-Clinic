import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

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
		this.auth.isLoggedObs.subscribe(logged => {
			this.isLogged = logged;
		});
		this.auth.isAdminObs.subscribe(admin => {
			this.isAdmin = admin;
		});

		this.router.navigateByUrl(this.isLogged ? 'home' : 'login');
	}
}
