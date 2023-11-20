import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Appointment } from '../classes/appointment';
import { DocumentReference, Timestamp } from 'firebase/firestore';
import { Patient } from '../classes/patient';
import { Specialist } from '../classes/specialist';
import { Survey } from '../classes/survey';

@Injectable({
  providedIn: 'root'
})
export class AfReferencesService {

  constructor(private db: DatabaseService) { }

	readonly apptMap = async (appt: Appointment) => {
		if (appt.patient instanceof DocumentReference)
			appt.patient = await this.db.getObjDataByRef<Patient>(appt.patient);

		if (appt.specialist instanceof DocumentReference)
			appt.specialist = await this.db.getObjDataByRef<Specialist>(appt.specialist);

		if (appt.date instanceof Timestamp)
			appt.date = appt.date.toDate();

		if (appt.patSurvey instanceof DocumentReference)
			appt.patSurvey = await this.db.getObjDataByRef<Survey>(appt.patSurvey);

		return appt;
	};
}
