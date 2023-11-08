import { StringIdValuePair } from "../environments/environment";
import { Patient } from "./patient";
import { Specialist } from "./specialist";
import { Survey } from "./survey";

export type ApptStatus = 'pending' | 'cancelled' | 'accepted' | 'declined' | 'done';
export class Appointment {
	id: string;
	patient: Patient;
	specialty: StringIdValuePair;
	specialist: Specialist;
	date: Date;
	status: ApptStatus;
	specReview: string;
	// patSurvey: Survey;
	
	// constructor(id: string = '', patient: Patient, specialty: StringIdValuePair, specialist: Specialist, date: Date, status: ApptStatus = 'pending', specReview: string = '', patSurvey: Survey) {
	constructor(id: string = '', patient: Patient, specialty: StringIdValuePair, specialist: Specialist, date: Date, status: ApptStatus = 'pending', specReview: string = '') {
		this.id = id;
		this.patient = patient;
		this.specialty = specialty;
		this.specialist = specialist;
		this.date = date;
		this.status = status;
		this.specReview = specReview;
		// this.patSurvey = patSurvey;
	}
}
