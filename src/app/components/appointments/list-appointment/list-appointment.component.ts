import { Component, inject } from '@angular/core';
import { DocumentReference, Timestamp } from 'firebase/firestore';
import { Appointment, ApptStatus } from 'src/app/classes/appointment';
import { Patient } from 'src/app/classes/patient';
import { Specialist } from 'src/app/classes/specialist';
import { User } from 'src/app/classes/user';
import { InputSwal, Loader, StringIdValuePair, ToastError, ToastSuccess } from 'src/app/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

const apptDbPath = 'appointments';
@Component({
	selector: 'app-list-appointment',
	templateUrl: './list-appointment.component.html',
	styleUrls: ['./list-appointment.component.css']
})
export class ListAppointmentComponent {
	user: User;
	private appointments: Array<Appointment> = [];
	appointmentsToShow: Array<Appointment> = [];
	private specialtyArray: Array<StringIdValuePair> = [];
	private specialistArray: Array<Specialist> = [];
	private patientArray: Array<Patient> = [];

	public get SpecialtyArray() {
		return this.specialtyArray;
	}
	public get SpecialistArray() {
		return this.specialistArray;
	}
	public get PatientArray() {
		return this.patientArray;
	}

	constructor(private auth: AuthService, private db: DatabaseService) {
		this.user = inject(AuthService).LoggedUser!;
	}

	specialtyRadio: StringIdValuePair | null = null;
	specialistRadio: Specialist | null = null;
	patientRadio: Patient | null = null;

	async ngOnInit() {
		Loader.fire();
		await this.initAppointments();

		this.specialtyArray = await this.db.getData<StringIdValuePair>('specialties');

		await this.db.getData<User>('users')
			.then(data => {
				for (const user of data) {
					if (user.role === 'specialist')
						this.specialistArray.push(user as Specialist)
					else if (user.role === 'patient')
						this.patientArray.push(user as Patient)
				}
			});

		this.appointmentsToShow = this.appointments.sort((appt1, appt2) => appt1.date > appt2.date ? 1 : -1);
		Loader.close();
	}

	private async initAppointments() {
		let roleFilter: (appt: Appointment) => boolean;
		switch (this.user.role) {
			case 'patient':
				roleFilter = (appt: Appointment) => appt.patient.id === this.user.id;
				break;
			case 'specialist':
				roleFilter = (appt: Appointment) => appt.specialist.id === this.user.id;
				break;
			case 'admin':
				roleFilter = (appt: Appointment) => appt !== null;
				break;
		}

		this.appointments = await Appointment.getAppointments(this.db, roleFilter);
	}

	//#region Table Filters
	specialtyRadioChange(specialty: StringIdValuePair) {
		this.specialistRadio = null;
		this.patientRadio = null;
		this.specialtyRadio = specialty;

		const auxAppts = this.appointments.filter(appt => appt.specialty.id === this.specialtyRadio!.id);
		this.appointmentsToShow = auxAppts.sort((appt1, appt2) => appt1.date > appt2.date ? 1 : -1);
	}

	specialistRadioChange(specialist: Specialist) {
		this.specialtyRadio = null;
		this.patientRadio = null;
		this.specialistRadio = specialist;

		const auxAppts = this.appointments.filter(appt => appt.specialist.id === this.specialistRadio!.id);
		this.appointmentsToShow = auxAppts.sort((appt1, appt2) => appt1.date > appt2.date ? 1 : -1);
	}

	patientRadioChange(patient: Patient) {
		this.specialtyRadio = null;
		this.specialistRadio = null;
		this.patientRadio = patient;

		const auxAppts = this.appointments.filter(appt => appt.patient.id === this.patientRadio!.id);
		this.appointmentsToShow = auxAppts.sort((appt1, appt2) => appt1.date > appt2.date ? 1 : -1);
	}

	resetFilter() {
		this.specialistRadio = null;
		this.specialtyRadio = null;
		this.patientRadio = null;

		this.appointmentsToShow = this.appointments.sort((appt1, appt2) => appt1.date > appt2.date ? 1 : -1);
	}
	//#endregion

	async toggleApptStatus(appt: Appointment, newStatus: ApptStatus) {
		let review: SweetAlertResult<string> | undefined;
		if (newStatus === 'cancelled' || newStatus === 'declined') {
			if (this.user.role !== 'patient') {
				review = await InputSwal.fire({ inputLabel: "Why are you cancelling this appointment?" });
			}

			let confirmed = true;
			await Swal.fire({
				title: "Confirm",
				text: 'Are you sure you want to cancel this appointment?',
				icon: "question",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				cancelButtonText: "No, go back",
				confirmButtonText: "Yes, cancel"
			}).then((result) => {
				if (!result.isConfirmed)
					confirmed = false;
			});
			if (!confirmed) return;

			if (review?.value)
				this.db.updateDoc(apptDbPath, appt.id, { specReview: review.value });
		} else if (newStatus === 'done') {
			review = await InputSwal.fire({ inputLabel: "Leave a review for the patient." });
			if (review?.value)
				this.db.updateDoc(apptDbPath, appt.id, { specReview: review.value });
		}

		appt.status = newStatus;
		this.db.updateDoc(apptDbPath, appt.id, { status: newStatus });
	}

	showReview(appt: Appointment) {
		Swal.fire(`Dr. ${appt.specialist.lastName} said:`, appt.specReview);
	}

	fillSurvey(appt: Appointment) {

	}

	rateService(appt: Appointment) {

	}

	getBgClassApptStatus(status: ApptStatus) {
		switch (status) {
			case 'pending':
				return 'bg-warning';
			case 'accepted':
				return 'bg-success';
			case 'done':
				return 'bg-info';
			default:
				return 'bg-danger';
		}
	}
}
