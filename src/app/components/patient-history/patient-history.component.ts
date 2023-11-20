import { Component, Input } from '@angular/core';
import { Patient } from 'src/app/classes/patient';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.css']
})
export class PatientHistoryComponent {
	@Input() patient: Patient | undefined;

	constructor () { }
}
