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
	patReview: string;
	patSurvey: Survey | null;

	constructor(id: string = '', patient: Patient, specialty: StringIdValuePair, specialist: Specialist, date: Date, status: ApptStatus = 'pending', specReview: string = '', patReview: string = '', patSurvey: Survey | null) {
		this.id = id;
		this.patient = patient;
		this.specialty = specialty;
		this.specialist = specialist;
		this.date = date;
		this.status = status;
		this.specReview = specReview;
		this.patReview = patReview;
		this.patSurvey = patSurvey;
	}

	/**
	 * Gets the appointments from the database and parses the reference items into class objects.
	 * @param db DataBase Service instance.
	 * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
	 * @returns An Appointment array.
	 */
	static async getAppointments(db: DatabaseService, predicate: (value: Appointment, index: number, array: Appointment[]) => unknown) {
		const promises: Array<Promise<any>> = [];
		const appointments =
			(await db.getData<Appointment>('appointments')).filter(predicate);

		appointments.forEach(appt => {
			if (appt.patient instanceof DocumentReference)
				promises.push(db.getObjDataByRef<Patient>(appt.patient).then(data => appt.patient = data));

			if (appt.specialist instanceof DocumentReference)
				promises.push(db.getObjDataByRef<Specialist>(appt.specialist).then(data => appt.specialist = data));
			
			if (appt.date instanceof Timestamp)
				appt.date = appt.date.toDate();

			if (appt.patSurvey instanceof DocumentReference)
				promises.push(db.getObjDataByRef<Survey>(appt.patSurvey).then(data => appt.patSurvey = data));
		});

		await Promise.all(promises);
		return appointments;
	}
}
