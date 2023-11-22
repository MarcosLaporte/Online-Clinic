import { Component, EventEmitter, Input, Optional, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { Appointment } from 'src/app/classes/appointment';
import { Diagnosis } from 'src/app/classes/diagnosis';
import { Patient } from 'src/app/classes/patient';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
	selector: 'app-patient-history',
	templateUrl: './patient-history.component.html',
	styleUrls: ['./patient-history.component.css']
})
export class PatientHistoryComponent {
	@Input() patient: Patient | undefined;
	protected pastAppointments: Array<Appointment> = [];

	@Input() exportBtn: boolean = false;
	@Input() exportBtnText: string = 'Export';
	@Output() exportEvent = new EventEmitter<Array<Appointment>>();

	constructor(private db: DatabaseService, @Optional() public dialogRef: MatDialogRef<PatientHistoryComponent>) { }

	private readonly timestampParse = async (appt: Appointment) => {
		appt.date = appt.date instanceof Timestamp ? appt.date.toDate() : appt.date;
		return appt;
	}
	async ngOnInit() {
		this.db.listenColChanges<Appointment>(
			'appointments',
			this.pastAppointments,
			(appt) => appt.patient.id === this.patient?.id && appt.status === 'done',
			undefined,
			this.timestampParse
		);
	}

	getDataDiag(diag: Diagnosis) {
		return Diagnosis.getData(diag);
	}
}
