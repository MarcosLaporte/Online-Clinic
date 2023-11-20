import { Component, inject } from '@angular/core';
import { Appointment } from 'src/app/classes/appointment'; import { Specialist } from 'src/app/classes/specialist';
import { User } from 'src/app/classes/user';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
	selector: 'app-my-patients',
	templateUrl: './my-patients.component.html',
	styleUrls: ['./my-patients.component.css']
})
export class MyPatientsComponent {
	myAppointments: Array<Appointment> = [];
	readonly specialist: Specialist;

	constructor(private db: DatabaseService) {
		this.specialist = (inject(AuthService).LoggedUser)! as Specialist;
		this.db.listenColChanges<Appointment>(
			'appointments',
			this.myAppointments,
			(appt: Appointment) => appt.specialist.id === this.specialist.id,
			(a1: Appointment, a2: Appointment) => a1.date > a2.date ? 1 : -1
		);
	}

	readonly userFilterFunc = (apptUser: User) =>
		this.myAppointments.some(appt => appt.patient.id === apptUser.id)
}
