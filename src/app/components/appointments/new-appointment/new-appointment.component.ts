import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { Appointment } from 'src/app/classes/appointment';
import { Patient } from 'src/app/classes/patient';
import { Specialist } from 'src/app/classes/specialist';
import { User } from 'src/app/classes/user';
import { Loader, ToastError, ToastSuccess } from 'src/app/environments/environment';
import { AfReferencesService } from 'src/app/services/af-references.service';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import Swal from 'sweetalert2';
import { UserListConfig } from '../../user-btn-list/user-btn-list.component';
import { Specialty } from 'src/app/classes/specialty';

const apptDbPath = 'appointments';
const usersDbPath = 'users';
@Component({
	selector: 'app-new-appointment',
	templateUrl: './new-appointment.component.html',
	styleUrls: ['./new-appointment.component.css'],
	providers: [DatePipe]
})
export class NewAppointmentComponent {
	private appointments: Array<Appointment> = [];
	private readonly apptMapFunc: (appt: Appointment) => Promise<Appointment>;

	user: User;
	specialtyArray: Array<Specialty> = [];
	private specialistArray: Array<Specialist> = [];
	availableSpecialists: Array<Specialist> = []; //Specialists of the chosen specialty
	private availableDates: Array<Date> = [];
	groupedDates: [string, Date[]][] = [];

	constructor(private db: DatabaseService, private router: Router, private datePipe: DatePipe) {
		this.user = inject(AuthService).LoggedUser!;
		this.apptMapFunc = inject(AfReferencesService).apptMap;
	}

	patientIdNo: number = 0;
	patient: Patient | null = null;
	specialty: Specialty | null = null;
	specialist: Specialist | null = null;

	async ngOnInit() {
		Loader.fire();
		if (this.user.role === 'patient') {
			this.patientIdNo = this.user.idNo;
			this.patient = this.user as Patient;
		}

		this.db.listenColChanges<Appointment>(apptDbPath, this.appointments, undefined, undefined, this.apptMapFunc);
		this.db.listenColChanges<Specialty>('specialties', this.specialtyArray);
		this.db.listenColChanges<Specialist>(usersDbPath, this.availableSpecialists, (usr => usr.role === 'specialist' && (usr as Specialist).isEnabled));

		Loader.close();
	}

	readonly specBtnListConfig: UserListConfig = {
		containerClasses: 'col-auto image-div d-flex flex-column align-items-center',
		userBtnClasses: 'rounded-circle',
		patientAmount: 0,
		specialistAmount: Number.MAX_SAFE_INTEGER,
		adminAmount: 0,
		roleDisplay: 'none',
		nameDisplay: 'top',
	}

	lookUpPatient() {
		this.db.searchUserByIdNo(this.patientIdNo)
			.then(user => {
				if (user.role !== 'patient')
					throw new Error('This ID does not belong to a patient.');

				const patient = user as Patient;
				ToastSuccess.fire({ title: `${patient.firstName} ${patient.lastName}, ${patient.healthPlan.value}` });
				this.patient = patient;
			})
			.catch((error: any) => {
				this.patient = null;
				this.specialist = null;
				ToastError.fire({ title: 'Oops...', text: error.message });
			});
	}

	selectSpecialty() {
		this.specialist = null;
		this.availableSpecialists =
			this.specialistArray.filter(doc => doc.specialties.some((spec) => spec.id === this.specialty!.id)
			);
	}

	async selectSpecialist(specialist: User) {
		this.specialist = specialist as Specialist;
		const allDates = this.getAllSpecDates();
		const existingAppts = this.appointments.filter(appt => appt.specialist.id == this.specialist!.id && appt.status !== 'cancelled');

		const takenDates = existingAppts.map(appt => appt.date instanceof Timestamp ? appt.date.toDate() : appt.date);
		this.availableDates = allDates.filter(date => !takenDates.some(apptDate => apptDate.getTime() === date.getTime()));

		this.groupDatesByDay();
	}

	/**
	 * Returns all the dates the specialist can take appointments, whether they are free or not.
	 */
	private getAllSpecDates(): Array<Date> {
		let datesArray: Array<Date> = [];

		let [hoursStr, minutesStr] = this.specialist!.shiftStart.split(':');
		const hoursStart = parseInt(hoursStr, 10);
		const minutesStart = parseInt(minutesStr, 10);
		const startDate: Date = new Date();
		startDate.setDate(startDate.getDate() + 1); //Next day
		startDate.setHours(hoursStart, minutesStart, 0, 0);

		[hoursStr, minutesStr] = this.specialist!.shiftEnd.split(':');
		const hoursEnd = parseInt(hoursStr, 10);
		const minutesEnd = parseInt(minutesStr, 10);
		const endDate: Date = new Date(startDate);
		endDate.setDate(endDate.getDate() + 15); //15 days from start day
		endDate.setHours(hoursEnd, minutesEnd, 0, 0);

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
				const newAppt: any = new Appointment('', this.patient!, this.specialty!, this.specialist!, date, 'pending', '', '', '', null);
				newAppt.patient = this.db.getDocRef(usersDbPath, newAppt.patient.id);
				newAppt.specialist = this.db.getDocRef(usersDbPath, newAppt.specialist.id);
				this.db.addDataAutoId(apptDbPath, newAppt);
				Swal.fire({
					title: "Date assigned!",
					text: "We'll be waiting for you at Av. Mitre 750.",
					icon: "success"
				}).then(() => this.router.navigateByUrl('home'));
			}
		});
	}
}
