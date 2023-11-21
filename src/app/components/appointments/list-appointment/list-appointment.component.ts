import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appointment, ApptStatus } from 'src/app/classes/appointment';
import { Patient } from 'src/app/classes/patient';
import { Specialist } from 'src/app/classes/specialist';
import { InputSwal, Loader, ToastSuccess } from 'src/app/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ApptSurveyComponent } from '../appt-survey/appt-survey.component';
import { Admin } from 'src/app/classes/admin';
import { AfReferencesService } from 'src/app/services/af-references.service';
import { Specialty } from 'src/app/classes/specialty';

const apptDbPath = 'appointments';
@Component({
	selector: 'app-list-appointment',
	templateUrl: './list-appointment.component.html',
	styleUrls: ['./list-appointment.component.css']
})
export class ListAppointmentComponent {
	user: Patient | Specialist | Admin;
	private appointments: Array<Appointment> = [];
	appointmentsToShow: Array<Appointment> = [];
	private specialtyArray: Array<Specialty> = [];
	private specialistArray: Array<Specialist> = [];
	private patientArray: Array<Patient> = [];
	private readonly apptRoleFilter: (appt: Appointment) => boolean;
	private readonly apptMapFunc: (appt: Appointment) => Promise<Appointment>;

	public get SpecialtyArray() {
		return this.specialtyArray;
	}
	public get SpecialistArray() {
		return this.specialistArray;
	}
	public get PatientArray() {
		return this.patientArray;
	}

	constructor(private db: DatabaseService, private dialog: MatDialog) {
		this.user = inject(AuthService).LoggedUser!;
		this.apptMapFunc = inject(AfReferencesService).apptMap;

		switch (this.user.role) {
			case 'patient':
				this.apptRoleFilter = (appt: Appointment) => appt.patient.id === this.user.id;
				break;
			case 'specialist':
				this.apptRoleFilter = (appt: Appointment) => appt.specialist.id === this.user.id;
				break;
			case 'admin':
				this.apptRoleFilter = (appt: Appointment) => appt !== null;
				break;
		}
	}

	specialtyRadio: Specialty | null = null;
	specialistRadio: Specialist | null = null;
	patientRadio: Patient | null = null;

	async ngOnInit() {
		Loader.fire();
		this.specialtyArray = await this.db.getData<Specialty>('specialties');

		this.db.listenColChanges<Specialist>('users', this.specialistArray, (usr => usr.role === 'specialist'));
		this.db.listenColChanges<Patient>('users', this.patientArray, (usr => usr.role === 'patient'));
		this.db.listenColChanges<Appointment>(apptDbPath, this.appointments, this.apptRoleFilter, undefined, this.apptMapFunc);

		this.appointmentsToShow = this.appointments.sort((appt1, appt2) => appt1.date > appt2.date ? 1 : -1);
		Loader.close();
	}

	//#region Table Filters
	specialtyRadioChange(specialty: Specialty) {
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

	async changeApptStatus(appt: Appointment, newStatus: ApptStatus) {
		let swalInput: SweetAlertResult<string> | undefined;
		switch (newStatus) {
			case 'cancelled':
			case 'declined':
				if (this.user.role !== 'patient') {
					swalInput = await InputSwal.fire({ inputLabel: "Why are you cancelling this appointment?" });
					if (!swalInput?.value) break;
				}

				const confirmed = await Swal.fire({
					title: "Confirm",
					text: 'Are you sure you want to cancel this appointment?',
					icon: "question",
					showCancelButton: true,
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
					cancelButtonText: "No, go back",
					confirmButtonText: "Yes, cancel"
				}).then((result) => result.isConfirmed);

				if (confirmed)
					this.db.updateDoc(apptDbPath, appt.id, { specReview: appt.specReview, status: newStatus });
				break;
			case 'accepted':
				this.db.updateDoc(apptDbPath, appt.id, { status: newStatus });
				break;
			case 'done':
				swalInput = await InputSwal.fire({ inputLabel: "Leave a review for the patient." });
				if (!swalInput?.value) break;
				const review = swalInput?.value;

				swalInput = await InputSwal.fire({ inputLabel: "What was the diagnosis?" });
				if (!swalInput?.value) break;
				const diag = swalInput?.value;

				if (swalInput?.value)
					this.db.updateDoc(apptDbPath, appt.id, { specReview: review, diagnosis: diag, status: newStatus });
				break;
		}
	}

	showReview(appt: Appointment) {
		if (this.user.role === 'patient') {
			Swal.fire(`Dr. ${appt.specialist.lastName} said:`, appt.specReview)
				.then(() => Swal.fire(`Diagnosis:`, appt.diagnosis));
		} else
			Swal.fire(`${appt.patient.lastName} said:`, appt.patReview);
	}

	fillSurvey(appt: Appointment) {
		const dialogRef = this.dialog.open(ApptSurveyComponent, {
			width: '800px',

		});
		dialogRef.componentInstance.patient = this.user as Patient;

		dialogRef.afterClosed().subscribe(survey => {
			if (survey) {
				const surveyRef = this.db.getDocRef('surveys', survey.id);
				appt.patSurvey = survey;
				this.db.updateDoc(apptDbPath, appt.id, { patSurvey: surveyRef })
					.then(() => ToastSuccess.fire('Survey uploaded!', 'Appointment closed.'));
			}
		});
	}

	async patientReview(appt: Appointment) {
		let review: SweetAlertResult<string> | undefined;
		if (this.user.role === 'patient') {
			review = await InputSwal.fire({ inputLabel: "Leave a review for the specialist." });
		}

		if (review?.value) {
			appt.patReview = review.value;
			this.db.updateDoc(apptDbPath, appt.id, { patReview: review.value });
		}
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
