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
import { Specialty } from 'src/app/classes/specialty';
import { Timestamp } from 'firebase/firestore';
import { ApptDiagnosisComponent } from '../appt-diagnosis/appt-diagnosis.component';
import { Diagnosis } from 'src/app/classes/diagnosis';

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
	filterInput: string = '';

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

	private readonly dateSort = (a: Appointment, b: Appointment) => a.date > b.date ? 1 : -1;
	private readonly timestampParse = async (appt: Appointment) => {
		appt.date = appt.date instanceof Timestamp ? appt.date.toDate() : appt.date;
		return appt;
	}
	async ngOnInit() {
		Loader.fire();
		this.specialtyArray = await this.db.getData<Specialty>('specialties');

		this.db.listenColChanges<Specialist>('users', this.specialistArray, (usr => usr.role === 'specialist'));
		this.db.listenColChanges<Patient>('users', this.patientArray, (usr => usr.role === 'patient'));
		this.db.listenColChanges<Appointment>(apptDbPath, this.appointments, this.apptRoleFilter, this.dateSort, this.timestampParse);

		this.appointmentsToShow = this.appointments;
		Loader.close();
	}

	filterTable() {
		if (this.filterInput) {
			this.appointmentsToShow = this.appointments.filter(
				(appt) =>
					this.includesFilterInput(appt.patient.firstName) ||
					this.includesFilterInput(appt.patient.lastName) ||
					this.includesFilterInput(`${appt.patient.firstName} ${appt.patient.lastName}`) ||
					this.includesFilterInput(appt.patient.healthPlan.value) ||
					this.includesFilterInput(appt.specialty.value) ||
					this.includesFilterInput(appt.specialist.firstName) ||
					this.includesFilterInput(appt.specialist.lastName) ||
					this.includesFilterInput(`${appt.specialist.firstName} ${appt.specialist.lastName}`) ||
					this.includesFilterInput(appt.date.toDateString()) ||
					this.includesFilterInput(appt.specReview) ||
					(appt.diagnosis &&
						(this.includesFilterInput(appt.diagnosis.additionalData[0].key) ||
							this.includesFilterInput(appt.diagnosis.additionalData[1].key) ||
							this.includesFilterInput(appt.diagnosis.additionalData[2].key))) ||
					this.includesFilterInput(appt.patReview)
			);
		} else {
			this.appointmentsToShow = this.appointments;
		}

	}

	private includesFilterInput(value: string): boolean {
		return value.toLowerCase().includes(this.filterInput.toLowerCase());
	}

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

				const dialogRef = this.dialog.open(ApptDiagnosisComponent, {
					width: '800px',
				});
				dialogRef.componentInstance.patient = this.user as Patient;

				dialogRef.afterClosed().subscribe(diagnosis => {
					if (diagnosis) {
						appt.diagnosis = diagnosis;
						this.db.updateDoc(apptDbPath, appt.id, { specReview: review, diagnosis: diagnosis, status: newStatus });
					}
				});

				break;
		}
	}

	showReview(appt: Appointment) {
		if (this.user.role !== 'specialist') {
			Swal.fire(`Dr. ${appt.specialist.lastName} said:`, appt.specReview)
				.then(() => {
					if (appt.diagnosis) {
						Swal.fire({
							title: 'Diagnosis:',
							text: Diagnosis.getData(appt.diagnosis),
							customClass: { container: 'break-spaces' }
						});
					}
				});
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
				appt.patSurvey = survey;
				this.db.updateDoc(apptDbPath, appt.id, { patSurvey: survey })
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
