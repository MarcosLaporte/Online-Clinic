import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Appointment } from 'src/app/classes/appointment';

@Component({
  selector: 'app-appt-filter',
  templateUrl: './appt-filter.component.html',
  styleUrls: ['./appt-filter.component.css']
})
export class ApptFilterComponent {
	@Input() appointmentList: Array<Appointment> = [];
	@Output() filteredList = new EventEmitter<Array<Appointment>>();

	filterInput: string = '';

	filterTable() {
		let appointments: Array<Appointment> = [];
		if (this.filterInput) {
			appointments = this.appointmentList.filter(
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
			appointments = this.appointmentList;
		}

		this.filteredList.emit(appointments);
	}

	private includesFilterInput(value: string): boolean {
		return value.toLowerCase().includes(this.filterInput.toLowerCase());
	}
}
