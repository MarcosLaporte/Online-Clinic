import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patient } from 'src/app/classes/patient';
import { DatabaseService } from 'src/app/services/database.service';
import { Diagnosis } from 'src/app/classes/diagnosis';
import { ToastError } from 'src/app/environments/environment';

@Component({
	selector: 'app-appt-diagnosis',
	templateUrl: './appt-diagnosis.component.html',
	styleUrls: ['./appt-diagnosis.component.css'],
})
export class ApptDiagnosisComponent {
	diagnosisForm: FormGroup;
	@Input() patient: Patient | undefined;


	constructor(private db: DatabaseService, public dialogRef: MatDialogRef<ApptDiagnosisComponent>, private fb: FormBuilder) {
		this.diagnosisForm = fb.group({
			height: [
				[
					Validators.required,
					Validators.min(20),
					Validators.max(280),
				]
			],
			weight: [
				[
					Validators.required,
					Validators.min(0.5),
					Validators.max(700),
				]
			],
			temperature: [
				[
					Validators.required,
					Validators.min(23),
					Validators.max(45),
				]
			],
			systolic: [
				[
					Validators.required,
					Validators.min(25),
					Validators.max(215),
				]
			],
			diastolic: [
				[
					Validators.required,
					Validators.min(10),
					Validators.max(130),
				]
			],
			additional1: fb.group({
				key: ['', Validators.required],
				value: [, Validators.required],
			}),
			additional2: fb.group({
				key: ['', Validators.required],
				value: [, Validators.required],
			}),
			additional3: fb.group({
				key: ['', Validators.required],
				value: [, Validators.required],
			}),
		});
	}

	async submitDiagnosis() {
		const height = <number>this.diagnosisForm.get('height')?.value;
		const weight = <number>this.diagnosisForm.get('weight')?.value;
		const tempC = <number>this.diagnosisForm.get('temperature')?.value;
		const systolic = <string>this.diagnosisForm.get('systolic')?.value;
		const diastolic = <string>this.diagnosisForm.get('diastolic')?.value;
		const pressure = systolic + '/' + diastolic;
		const additional1 = <{ key: string, value: number }>this.diagnosisForm.get('additional1')?.value;
		const additional2 = <{ key: string, value: number }>this.diagnosisForm.get('additional2')?.value;
		const additional3 = <{ key: string, value: number }>this.diagnosisForm.get('additional3')?.value;

		const diagnosis = new Diagnosis('', height, weight, tempC, pressure, [additional1, additional2, additional3]);

		this.db.addDataAutoId('diagnosis', diagnosis)
			.then(() => this.dialogRef.close(diagnosis))
			.catch((error: any) => ToastError.fire('There was an error uploading the diagnosis.', error.message));
	}
}
