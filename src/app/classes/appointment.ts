import { StringKeyValuePair } from "../environments/environment";
import { Patient } from "./patient";
import { Specialist } from "./specialist";

export class Appointment {
	id: string;
	patient: Patient;
	specialty: StringKeyValuePair;
	specialist: Specialist;
	date: Date;
	isActive: boolean;
	
	constructor(id: string = '', patient: Patient, specialty: StringKeyValuePair, specialist: Specialist, date: Date, isActive: boolean) {
		this.id = id;
		this.patient = patient;
		this.specialty = specialty; //TODO: Delete and set as specialist.specialty?
		this.specialist = specialist;
		this.date = date;
		this.isActive = isActive;
	}
}
