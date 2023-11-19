import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Admin } from 'src/app/classes/admin';
import { Patient } from 'src/app/classes/patient';
import { Specialist } from 'src/app/classes/specialist';
import { User } from 'src/app/classes/user';
import { Loader, ToastError, ToastSuccess } from 'src/app/environments/environment';
import { DatabaseService } from 'src/app/services/database.service';
import { NewAccountTemplateComponent } from '../new-account-template/new-account-template.component';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
	users: Array<User> = [];
	constructor(private db: DatabaseService, private dialog: MatDialog) { }

	async ngOnInit() {
		this.db.listenColChanges<User>('users', this.users, undefined, undefined, this.userMap);
	}
	
	private readonly userMap = async (user: User) => {
		switch (user.role) {
			case 'patient':
				return user as Patient;
			case 'specialist':
				return user as Specialist;
			case 'admin':
				return user as Admin;
		}
	};

	parseSpecialist = (user: User) => {
		return user as Specialist;
	}

	showSpecs(specialist: Specialist) {
		let specsStr: string = "";
		for(const spec of specialist.specialties) {
			specsStr += '+ ' + spec.value + '<br>';
		}

		Swal.fire(`Dr. ${specialist.lastName} is:`, specsStr, 'info');
	}

	async toggleEnable(specialist: Specialist) {
		const newValue = !specialist.isEnabled;
		Loader.fire();
		await this.db.updateDoc('users', specialist.id, { isEnabled: newValue })
			.then(() => {
				const status = newValue ? 'enabled' : 'disabled';
				ToastSuccess.fire({ title: 'Done!', text: `Specialist #${specialist.idNo} ${status}!` });
				specialist.isEnabled = newValue;
			})
			.catch((error) => { ToastError.fire({ title: 'Oops...', text: error.message }); });
	}

	newAccount() {
		const dialogRef = this.dialog.open(NewAccountTemplateComponent, {
			width: '800px',
			
		});


		dialogRef.afterClosed().subscribe(survey => {
			if (survey) {
				// const surveyRef = this.db.getDocRef('surveys', survey.id);
				// this.db.updateDoc(apptDbPath, appt.id, { patSurvey: surveyRef })
				// 	.then(() => ToastSuccess.fire('Survey uploaded!', 'Appointment closed.'));
			}
		});
	}
}
