import { Diagnosis } from "./diagnosis";
import { Patient } from "./patient";
import { Specialist } from "./specialist";
import { Specialty } from "./specialty";
import { Survey } from "./survey";

export type ApptStatus = 'pending' | 'cancelled' | 'accepted' | 'declined' | 'done';
export class Appointment {
	id: string;
	patient: Patient;
	specialty: Specialty;
	specialist: Specialist;
	date: Date;
	status: ApptStatus;
	specReview: string;
	diagnosis: Diagnosis | null;
	patReview: string;
	patSurvey: Survey | null;

	constructor(id: string = '', patient: Patient, specialty: Specialty, specialist: Specialist, date: Date, status: ApptStatus = 'pending', specReview: string = '', diagnosis: Diagnosis | null, patReview: string = '', patSurvey: Survey | null) {
		this.id = id;
		this.patient = patient;
		this.specialty = specialty;
		this.specialist = specialist;
		this.date = date;
		this.status = status;
		this.specReview = specReview;
		this.diagnosis = diagnosis;
		this.patReview = patReview;
		this.patSurvey = patSurvey;
	}
}