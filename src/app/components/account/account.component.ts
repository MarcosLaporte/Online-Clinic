import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/classes/user';
import { ToastSuccess, ToastError, ToastWarning } from 'src/app/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.css']
})
export class AccountComponent {
	user: User | null = null;

	constructor(private auth: AuthService, private router: Router) {
		this.user = auth.LoggedUser;
	}

	/* async ngOnInit() {
		Loader.fire();
		await this.auth.getLoggedUser()
			.then((user) => {
				this.user = user;
			});
		Loader.close();
	} */

	signOut() {
		this.auth.signOut()
			.then(() => {
				ToastSuccess.fire({ title: 'Signed out!' });
				this.router.navigateByUrl('login');
			})
			.catch((error: any) => {
				if (error)
					ToastWarning.fire({ title: 'Oops...', text: error.message });
				else
					ToastError.fire({ title: 'Oops...', text: error.message });
			});
	}
}
