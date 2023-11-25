import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appointment } from 'src/app/classes/appointment'; import { Patient } from 'src/app/classes/patient';
import { Specialist } from 'src/app/classes/specialist';
import { User } from 'src/app/classes/user';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { PatientHistoryComponent } from '../patient-history/patient-history.component';

@Component({
	selector: 'app-my-patients',
	templateUrl: './my-patients.component.html',
	styleUrls: ['./my-patients.component.css']
})
export class MyPatientsComponent {
	myAppointments: Array<Appointment> = [];
	patients: Array<Patient> = [];
	readonly specialist: Specialist;

	constructor(private db: DatabaseService, private dialog: MatDialog) {
		this.specialist = (inject(AuthService).LoggedUser)! as Specialist;
	}

	ngOnInit() {
		this.db.listenColChanges<Appointment>(
			'appointments',
			this.myAppointments,
			(appt: Appointment) => appt.specialist.id === this.specialist.id,
			(a1: Appointment, a2: Appointment) => a1.date > a2.date ? 1 : -1
		);

		this.db.listenColChanges<User>(
			'users',
			this.patients,
			this.patFilter,
			undefined,
			(async user => user as Patient)
		);
	}

	readonly patFilter = (patient: User) =>
		patient.role === 'patient' && this.myAppointments.some(appt => appt.patient.id === patient.id);

	readonly parsePatient = (user: User) => user as Patient;

	async showMedicalHistory(patient: Patient) {
		const dialogRef = this.dialog.open(PatientHistoryComponent, {
			width: '1200px'
		});

		dialogRef.componentInstance.patient = patient;
	}
}
