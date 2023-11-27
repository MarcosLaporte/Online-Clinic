import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { Appointment } from 'src/app/classes/appointment';
import { DatabaseService } from 'src/app/services/database.service';
import { Specialty } from 'src/app/classes/specialty';

const datePipe = new DatePipe('en-US', '-0300');
type GroupData<T> = {
	groupBy: (item: T) => any;
	labelFormatter: (group: any) => string;
	data: T[];
};
@Component({
	selector: 'app-stats',
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.css']
})
export class StatsComponent {
	readonly appointments: Array<Appointment> = [];

	public newApptTimeStart: Date | undefined;
	public newApptTimeEnd: Date | undefined;
	public apptDoneTimeStart: Date | undefined;
	public apptDoneTimeEnd: Date | undefined;

	constructor(private db: DatabaseService) {
		this.db.listenColChanges<Appointment>(
			'appointments',
			this.appointments,
			undefined,
			(a1: Appointment, a2: Appointment) => a1.date > a2.date ? 1 : -1,
			async appt => { appt.date = appt.date instanceof Timestamp ? appt.date.toDate() : appt.date; return appt; }
		);
	}


	//#region Appointments per day
	getApptsDayData() {
		const dayAppt: Array<{ date: Date, appointments: Appointment[] }> =
			this.groupApptsByDay();

		const labels: Array<string> = [];
		const data: Array<number> = [];
		const colors: Array<string> = [];

		dayAppt.forEach(group => {
			labels.push(datePipe.transform(group.date, 'dd/M/yy')!);
			data.push(group.appointments.length);
			colors.push(this.getColor());
		});

		return {
			labels: labels,
			datasets: [
				{
					data: data,
					label: 'Appointments',
					backgroundColor: colors,
				}
			],
		}
	}

	private groupApptsByDay(): Array<{ date: Date, appointments: Appointment[] }> {
		const auxAppts = [...this.appointments];
		const dayAppt: Map<number, { date: Date, appointments: Appointment[] }> =
			auxAppts.reduce((map, appt) => {
				const auxDate = appt.date;
				auxDate.setHours(0, 0, 0, 0);
				const key = auxDate.getTime();

				if (!map.has(key))
					map.set(key, { date: appt.date, appointments: [] });

				map.get(key)!.appointments.push(appt);

				return map;
			}, new Map<number, { date: Date, appointments: Appointment[] }>());

		return Array.from(dayAppt.values());
	}
	//#endregion

	//#region Appointments per specialty
	getApptsSpecData() {
		const specAppt: Array<{ specialty: Specialty, appointments: Appointment[] }> =
			this.groupApptsBySpec();

		const labels: Array<string> = [];
		const data: Array<number> = [];
		const colors: Array<string> = [];

		specAppt.forEach(group => {
			labels.push(group.specialty.value);
			data.push(group.appointments.length);
			colors.push(this.getColor());
		});

		return {
			labels: labels,
			datasets: [
				{
					data: data,
					label: 'Appointments',
					backgroundColor: colors,
				}
			],
		}
	}

	private groupApptsBySpec(): Array<{ specialty: Specialty, appointments: Appointment[] }> {
		const auxAppts = [...this.appointments];
		const specAppt: Map<string, { specialty: Specialty, appointments: Appointment[] }> = auxAppts.reduce((map, appt) => {
			const key = appt.specialty.id;

			if (!map.has(key))
				map.set(key, { specialty: appt.specialty, appointments: [] });

			map.get(key)!.appointments.push(appt);

			return map;
		}, new Map<string, { specialty: Specialty, appointments: Appointment[] }>());

		return Array.from(specAppt.values());
	}

	//#endregion

	//#region Appointments between dates
	getApptsBetweenDatesData() {
		if (!this.newApptTimeStart || !this.newApptTimeEnd) return;
		const datesAppt: Array<{ date: Date, appointments: Appointment[] }>
			= this.groupApptsBetweenDates(this.newApptTimeStart, this.newApptTimeEnd);

		const labels: Array<string> = [];
		const data: Array<number> = [];
		const colors: Array<string> = [];

		datesAppt.forEach(group => {
			labels.push(datePipe.transform(group.date, 'dd/M/yy')!);
			data.push(group.appointments.length);
			colors.push(this.getColor());
		});

		return {
			labels: labels,
			datasets: [
				{
					data: data,
					label: 'Appointments',
					backgroundColor: colors,
				}
			],
		}
	}

	private groupApptsBetweenDates(startDate: Date, endDate: Date, filter?: (appt: Appointment) => boolean): Array<{ date: Date, appointments: Appointment[] }> {
		const auxAppts = [...this.appointments];
		const dayAppt: Map<string, { date: Date, appointments: Appointment[] }> =
			auxAppts.filter(appt => appt.date >= startDate && appt.date <= endDate).reduce((map, appt) => {
				const key = appt.specialist.id;

				if (!map.has(key))
					map.set(key, { date: appt.date, appointments: [] });

				map.get(key)!.appointments.push(appt);

				return map;
			}, new Map<string, { date: Date, appointments: Appointment[] }>());

		return Array.from(dayAppt.values());
	}

	//#endregion

	//#region Finished Appointments between dates
	getFinishedApptsBetweenDatesData() {
		if (!this.newApptTimeStart || !this.newApptTimeEnd) return;
		const datesAppt: Array<{ date: Date, appointments: Appointment[] }>
			= this.groupFinApptsBetweenDates(this.newApptTimeStart, this.newApptTimeEnd);

		const labels: Array<string> = [];
		const data: Array<number> = [];
		const colors: Array<string> = [];

		datesAppt.forEach(group => {
			labels.push(datePipe.transform(group.date, 'dd/M/yy')!);
			data.push(group.appointments.length);
			colors.push(this.getColor());
		});

		return {
			labels: labels,
			datasets: [
				{
					data: data,
					label: 'Appointments',
					backgroundColor: colors,
				}
			],
		}
	}

	private groupFinApptsBetweenDates(startDate: Date, endDate: Date): Array<{ date: Date, appointments: Appointment[] }> {
		const auxAppts = [...this.appointments];
		const dayAppt: Map<string, { date: Date, appointments: Appointment[] }> =
			auxAppts.filter(appt => appt.status === 'done' && appt.date >= startDate && appt.date <= endDate).reduce((map, appt) => {
				const key = appt.specialist.id;

				if (!map.has(key))
					map.set(key, { date: appt.date, appointments: [] });

				map.get(key)!.appointments.push(appt);

				return map;
			}, new Map<string, { date: Date, appointments: Appointment[] }>());

		return Array.from(dayAppt.values());
	}

	//#endregion

	private getColor() {
		return "hsl(" + 360 * Math.random() + ',' +
			(25 + 70 * Math.random()) + '%,' +
			(85 + 10 * Math.random()) + '%)'
	}
}
