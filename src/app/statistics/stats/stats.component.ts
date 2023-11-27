import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { Appointment } from 'src/app/classes/appointment';
import { DatabaseService } from 'src/app/services/database.service';
import { Specialty } from 'src/app/classes/specialty';
import { Loader } from 'src/app/environments/environment';
import { ChartData } from 'chart.js';

const datePipe = new DatePipe('en-US', '-0300');
const emptyChartData = {
	labels: [],
	datasets: []
};
@Component({
	selector: 'app-stats',
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.css']
})
export class StatsComponent {
	private appointments: Array<Appointment> = [];
	public chartsData: ChartData[] = [emptyChartData, emptyChartData, emptyChartData, emptyChartData];

	constructor(private db: DatabaseService) { }

	readonly lineChartOptions = {
		responsive: true,
		scales: {
			y: {
				suggestedMin: 0,
				suggestedMax: 6,
				ticks: {
					stepSize: 1,
				}
			}
		}
	}

	async ngOnInit() {
		Loader.fire();
		const auxArray = await this.db.getData<Appointment>('appointments');

		this.appointments = auxArray
			.map(appt => { appt.date = appt.date instanceof Timestamp ? appt.date.toDate() : appt.date; return appt; })
			.sort((a1: Appointment, a2: Appointment) => a1.date > a2.date ? 1 : -1);

		this.chartsData[0] = this.getApptsDayData();
		this.chartsData[1] = this.getApptsSpecData();
		this.chartsData[2] = this.getApptsBetweenDatesData()!;
		this.chartsData[3] = this.getFinishedApptsBetweenDatesData()!;

		Loader.close();
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
		const auxAppts = this.appointments;
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
		const auxAppts = this.appointments;
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
	public newApptTimeStart: string = '2023-11-01';
	public newApptTimeEnd: string = '2023-12-01';
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

	private groupApptsBetweenDates(startDate: string, endDate: string): Array<{ date: Date, appointments: Appointment[] }> {
		const auxAppts = this.appointments;
		const auxStart = new Date(startDate);
		const auxEnd = new Date(endDate);

		const dayAppt: Map<string, { date: Date, appointments: Appointment[] }> =
			auxAppts.filter(appt => appt.date >= auxStart && appt.date <= auxEnd).reduce((map, appt) => {
				const key = appt.specialist.id;

				if (!map.has(key))
					map.set(key, { date: appt.date, appointments: [] });

				map.get(key)!.appointments.push(appt);

				return map;
			}, new Map<string, { date: Date, appointments: Appointment[] }>());

		return Array.from(dayAppt.values());
	}

	loadChart3() {
		this.chartsData[2] = this.getApptsBetweenDatesData()!;
	}
	//#endregion

	//#region Finished Appointments between dates
	public apptDoneTimeStart: string = '2023-11-01';
	public apptDoneTimeEnd: string = '2023-12-01';
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

	private groupFinApptsBetweenDates(startDate: string, endDate: string): Array<{ date: Date, appointments: Appointment[] }> {
		const auxAppts = this.appointments;
		const auxStart = new Date(startDate);
		const auxEnd = new Date(endDate);

		const dayAppt: Map<string, { date: Date, appointments: Appointment[] }> =
			auxAppts.filter(appt => appt.status === 'done' && appt.date >= auxStart && appt.date <= auxEnd).reduce((map, appt) => {
				const key = appt.specialist.id;

				if (!map.has(key))
					map.set(key, { date: appt.date, appointments: [] });

				map.get(key)!.appointments.push(appt);

				return map;
			}, new Map<string, { date: Date, appointments: Appointment[] }>());

		return Array.from(dayAppt.values());
	}

	loadChart4() {
		this.chartsData[3] = this.getFinishedApptsBetweenDatesData()!;
	}
	//#endregion

	private getColor() {
		return "hsl(" + 360 * Math.random() + ',' +
			(25 + 70 * Math.random()) + '%,' +
			(85 + 10 * Math.random()) + '%)'
	}
}
