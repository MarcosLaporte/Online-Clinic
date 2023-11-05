import { Component } from '@angular/core';
import { Admin } from 'src/app/classes/admin';
import { Patient } from 'src/app/classes/patient';
import { Specialist } from 'src/app/classes/specialist';
import { User } from 'src/app/classes/user';
import { Toast } from 'src/app/environments/environment';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
	users: Array<User> = [];
	constructor(private db: DatabaseService) { }

	async ngOnInit() {
		const auxUsers = await this.db.getData<User>('users');
		for (let user of auxUsers) {
			switch (user.role) {
				case 'patient':
					this.users.push(user as Patient);
					break;
				case 'specialist':
					this.users.push(user as Specialist);
					break;
				case 'admin':
					this.users.push(user as Admin);
					break;
			}
		}
	}

	parseSpecialist(user: User) {
			return user as Specialist;
	}

	async toggleEnable(specialist: Specialist) {
		const newValue = !specialist.isEnabled;
		await this.db.updateDoc('users', specialist.id, { isEnabled: newValue })
			.then(() => {
				const status = newValue ? 'enabled' : 'disabled';
				Toast.fire({ icon: 'success', title: 'Done!', text: `Specialist #${specialist.idNo} ${status}!`, background: '#a5dc86' });
				specialist.isEnabled = newValue;
			})
			.catch((error) => { Toast.fire({ icon: 'error', title: 'Oops...', text: error.message, background: '#f27474' }); });
	}
}
