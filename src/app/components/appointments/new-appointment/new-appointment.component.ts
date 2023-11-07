import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { Appointment } from 'src/app/classes/appointment';
import { Patient } from 'src/app/classes/patient';
import { Specialist } from 'src/app/classes/specialist';
import { User } from 'src/app/classes/user';
import { Loader, StringIdValuePair, Toast } from 'src/app/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-new-appointment',
	templateUrl: './new-appointment.component.html',
	styleUrls: ['./new-appointment.component.css'],
	providers: [DatePipe]
})
export class NewAppointmentComponent {

	user: User;
	specialtyArray: Array<StringIdValuePair> = [];
	private specialistArray: Array<Specialist> = [];
	availableSpecialists: Array<Specialist> = []; //Specialists of the chosen specialty
	private availableDates: Array<Date> = [];
	groupedDates: [string, Date[]][] = [];

	constructor(private db: DatabaseService, private auth: AuthService, private router: Router, private datePipe: DatePipe) {
		this.user = inject(AuthService).LoggedUser!;
	}

	patientIdNo: number = 0;
	patient: Patient | null = null;
	specialty: StringIdValuePair | null = null;
	specialist: Specialist | null = null;

	async ngOnInit() {
		Loader.fire();
		this.specialtyArray = await this.db.getData<StringIdValuePair>('specialties');

		await this.db.getData<User>('users')
			.then(data => {
				this.specialistArray = data
					.filter(user => user.role === 'specialist' && (user as Specialist).isEnabled)
					.map(spec => spec as Specialist);
			});

		if (this.user.role === 'patient'){
			this.patientIdNo = this.user.idNo;
			this.patient = this.user as Patient;
		}
		Loader.close();
	}

	lookUpPatient() {
		this.auth.searchUserByIdNo(this.patientIdNo)
			.then(user => {
				if (user.role !== 'patient')
					throw new Error('This ID does not belong to a patient.');

				const patient = user as Patient;
				Toast.fire({ icon: 'success', title: `${patient.firstName} ${patient.lastName}, ${patient.healthPlan.value}`, background: '#a5dc86' });
				this.patient = patient;
			})
			.catch(error => {
				this.patient = null;
				this.specialist = null;
				Toast.fire({ icon: 'error', title: 'Oops...', text: error.message, background: '#f27474' });
			});
	}

	selectSpecialty() {
		this.specialist = null;
		this.availableSpecialists =
			this.specialistArray.filter(spec => spec.specialty.id === this.specialty?.id);
	}

	async selectSpecialist(event: Event) {
		const allDates = this.getAllSpecDates();
		let takenDates: Array<Date> = [];
		await this.db.getData<Appointment>('appointments')
			.then(data => {
				takenDates = data
					.filter(appt => appt.specialist.id == this.specialist!.id && appt.isActive)
					.map(appt => appt.date instanceof Timestamp ? appt.date.toDate() : appt.date);
			});

		this.availableDates = allDates.filter(date => !takenDates.some(apptDate => apptDate.getTime() === date.getTime()));
		this.groupDatesByDay();
	}

	/**
	 * Returns all the dates the specialist can take appointments, whether they are free or not.
	 */
	private getAllSpecDates(): Array<Date> {
		let datesArray: Array<Date> = [];
		const startDate: Date = new Date();
		startDate.setDate(startDate.getDate() + 1); //Next day
		startDate.setHours(8, 30, 0, 0);
		const endDate: Date = new Date(startDate);
		endDate.setDate(endDate.getDate() + 15); //15 days from start day
		endDate.setHours(18, 30, 0, 0);

		let auxDate: Date = new Date(startDate);

		while (auxDate < endDate) {
			if (this.specialist?.workingDays.includes(auxDate.getDay())) {
				datesArray.push(new Date(auxDate));
				auxDate.setMinutes(auxDate.getMinutes() + 15);
				if (auxDate.getHours() === 18 && auxDate.getMinutes() === 30) {
					auxDate.setDate(auxDate.getDate() + 1);
					auxDate.setHours(8, 30, 0, 0);
				}
			} else {
				auxDate.setDate(auxDate.getDate() + 1);
			}
		}

		return datesArray;
	}

	groupDatesByDay() {
		const tempMap = new Map<string, Date[]>();

		this.availableDates.forEach(date => {
			const fullDate = this.datePipe.transform(date, 'fullDate');
			if (!tempMap.has(fullDate!)) {
				tempMap.set(fullDate!, [date]);
			} else {
				tempMap.get(fullDate!)!.push(date);
			}
		});

		this.groupedDates = Array.from(tempMap);
	}

	selectDate(date: Date) {
		const fullDate = this.datePipe.transform(date, 'fullDate');
		Swal.fire({
			title: "Confirm date",
			text: `${fullDate}; with Dr. ${this.specialist!.lastName}, ${this.specialty!.value}`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm"
		}).then((result) => {
			if (result.isConfirmed) {
				const newAppt = new Appointment('', this.patient!, this.specialty!, this.specialist!, date, true);
				this.db.addDataAutoId('appointments', newAppt);
				Swal.fire({
					title: "Date assigned!",
					text: "We'll be waiting for you at Av. Mitre 750.",
					icon: "success"
				}).then(() => this.router.navigateByUrl('home'));
			}
		});
	}
}
