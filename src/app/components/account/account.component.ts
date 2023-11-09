import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Specialist } from 'src/app/classes/specialist';
import { User } from 'src/app/classes/user';
import { ToastSuccess, ToastError, ToastWarning } from 'src/app/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.css']
})
export class AccountComponent {
	user: User | null = null;
	specialist: Specialist | null = null;

	constructor(private auth: AuthService, private db: DatabaseService, private router: Router) {
		this.user = auth.LoggedUser;
		if (this.user?.role === 'specialist')
			this.specialist = this.user as Specialist;
	}

	saveShift() {
		if (this.specialist!.shiftStart < '08:30' || this.specialist!.shiftEnd > '18:30')
			ToastError.fire('Oops...', 'Work hours are between 08:30 and 18:30.');
		else if (this.specialist!.shiftStart >= this.specialist!.shiftEnd)
			ToastError.fire('Oops...', 'Work hours should not overlap.');
		else {
			this.db.updateDoc('users', this.specialist?.id!, this.specialist)
				.then(() => ToastSuccess.fire('Shift hours updated!'))
				.catch((error: any) => ToastError.fire('Oops...', error.message));
		}
	}

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
