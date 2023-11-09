import { Component, Input, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from 'src/app/classes/patient';
import { DatabaseService } from 'src/app/services/database.service';
import { Survey } from 'src/app/classes/survey';
import { ToastError } from 'src/app/environments/environment';

@Component({
	selector: 'app-appt-survey',
	templateUrl: './appt-survey.component.html',
	styleUrls: ['./appt-survey.component.css']
})
export class ApptSurveyComponent {
	surveyForm: FormGroup;
	@Input() patient: Patient | undefined;

	constructor(private db: DatabaseService, private fb: FormBuilder, private router: Router,
		public dialogRef: MatDialogRef<ApptSurveyComponent>) {

		this.surveyForm = fb.group({
			attention: [
				null,
				[
					Validators.required,
					Validators.min(1),
					Validators.max(10),
				]
			],
			accessibility: [
				null,
				[
					Validators.required,
					Validators.min(1),
					Validators.max(10),
				]
			],
			recommend: [
				null,
				[
					Validators.required,
					Validators.min(1),
					Validators.max(10),
				]
			],
			comments: [
				'',
				[
					Validators.required,
					Validators.maxLength(255),
				]
			]
		});
	}

	async submitSurvey() {
		const attentionQualityGrade: number = this.surveyForm.get('attention')?.value;
		const accessibilityGrade: number = this.surveyForm.get('accessibility')?.value;
		const recommendGrade: number = this.surveyForm.get('recommend')?.value;
		const comments: string = this.surveyForm.get('comments')?.value;

		const survey = new Survey('', attentionQualityGrade, accessibilityGrade, recommendGrade, comments);
		
		try {
			this.db.addDataAutoId('surveys', survey);
			this.dialogRef.close(survey);
		} catch (error: any) {
			ToastError.fire('There was an error uploading the survey.', error.message);
		}
	}
}
