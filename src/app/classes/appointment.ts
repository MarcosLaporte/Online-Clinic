import { StringIdValuePair } from "../environments/environment";
import { Patient } from "./patient";
import { Specialist } from "./specialist";
import { Survey } from "./survey";
import { DatabaseService } from "../services/database.service";
import { DocumentReference, Timestamp } from "firebase/firestore";

export type ApptStatus = 'pending' | 'cancelled' | 'accepted' | 'declined' | 'done';
export class Appointment {
	id: string;
	patient: Patient;
	specialty: StringIdValuePair;
	specialist: Specialist;
	date: Date;
	status: ApptStatus;
	specReview: string;
	diagnosis: string;
	patReview: string;
	patSurvey: Survey | null;

	constructor(id: string = '', patient: Patient, specialty: StringIdValuePair, specialist: Specialist, date: Date, status: ApptStatus = 'pending', specReview: string = '', diagnosis: string = '', patReview: string = '', patSurvey: Survey | null) {
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