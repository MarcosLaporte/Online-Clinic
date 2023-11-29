import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { Appointment } from 'src/app/classes/appointment';
import { DatabaseService } from 'src/app/services/database.service';
import { Specialty } from 'src/app/classes/specialty';
import { Loader } from 'src/app/environments/environment';
import { ChartData } from 'chart.js';
import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

const pdf = pdfMake;
pdf.vfs = pdfFonts.pdfMake.vfs;
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
	public chartsData: Array<ChartData | undefined> = [];

	constructor(private db: DatabaseService) { }

	readonly chartOptions = {
		responsive: true,
		scales: {
			y: {
				suggestedMin: 0,
				suggestedMax: 3,
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
		this.loadChart3();
		this.loadChart4();

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
			]
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
	getApptsBetweenDatesData(apptsList: Array<Appointment>) {
		const apptsByDate = new Map<string, Appointment[]>();

		apptsList.forEach(appt => {
			const dateString = appt.date.toISOString().split('T')[0]; // Use ISO date without time
			if (!apptsByDate.has(dateString)) {
				apptsByDate.set(dateString, []);
			}
			apptsByDate.get(dateString)!.push(appt);
		});

		const apptsBySpecialist = new Map<string, Appointment[]>();
		apptsByDate.forEach((appointments) => {
			appointments.forEach(appt => {
				const specId = appt.specialist.id;
				if (!apptsBySpecialist.has(specId)) {
					apptsBySpecialist.set(specId, []);
				}
				apptsBySpecialist.get(specId)!.push(appt);
			});
		});

		const chartData: any = {
			labels: ['', ...Array.from(apptsByDate.keys()), ''],
			datasets: []
		};

		apptsBySpecialist.forEach((appts, specId) => {
			const specialist = appts[0].specialist;
			const dataset: any = {
				label: `${specialist.firstName} ${specialist.lastName}`,
				data: [0],
				borderColor: this.getColor(),
				fill: true,
				pointRadius: [0],
				pointHitRadius: 3
			};

			apptsByDate.forEach((dateAppts) => {
				const count = dateAppts.filter(appt => appt.specialist.id === specId).length;
				dataset.data.push(count);
				dataset.pointRadius.push(apptsByDate.size > 1 ? (count === 0 ? 0 : 3) : 3);
			});

			dataset.data.push(0);
			dataset.pointRadius.push(0);

			chartData.datasets.push(dataset);
		});

		return chartData;
	}

	public newApptTimeStart: string = '2023-11-01';
	public newApptTimeEnd: string = '2023-12-15';
	loadChart3() {
		const data = this.getApptsBetweenDatesData(
			this.appointments.filter(appt =>
				appt.status !== 'cancelled' && appt.status !== 'declined'
				&& appt.date >= new Date(this.newApptTimeStart) && appt.date <= new Date(this.newApptTimeEnd)));
		this.chartsData[2] = { ...data };
	}

	public apptDoneTimeStart: string = '2023-11-01';
	public apptDoneTimeEnd: string = '2023-12-15';
	loadChart4() {
		const data = this.getApptsBetweenDatesData(
			this.appointments.filter(appt => appt.status === 'done'
				&& appt.date >= new Date(this.apptDoneTimeStart) && appt.date <= new Date(this.apptDoneTimeEnd)));
		this.chartsData[3] = { ...data };
	}
	//#endregion

	private getColor() {
		const hue: number = 360 * Math.random();
		const saturation: number = 50 + 50 * Math.random();
		const lightness: number = 55 + 20 * Math.random();
		return `hsl(${hue}, ${saturation}%, ${lightness}%)`
	}

	saveChartToPDF() {
		const chartCanvases = [
			document.getElementById('chart1') as HTMLCanvasElement,
			document.getElementById('chart2') as HTMLCanvasElement,
			document.getElementById('chart3') as HTMLCanvasElement,
			document.getElementById('chart4') as HTMLCanvasElement,
		]

		const docDef = {
			pageSize: 'A4',
			pageOrientation: 'landscape',
			pageMargins: [40, 10],
			content: [
				{ text: 'Charts', fontSize: 18, bold: true, decoration: 'underline', alignment: 'center', margin: [0, 0, 0, 5] },
				{
					table: {
						headerRows: 0,
						widths: ['50%', '50%'],
						body: [
							[
								{
									image: chartCanvases[0].toDataURL('image/png'),
									alignment: 'center',
									width: 300,
									height: 200
								},
								{
									image: chartCanvases[1].toDataURL('image/png'),
									alignment: 'center',
									width: 200,
								},
							],
							[
								{
									image: chartCanvases[2].toDataURL('image/png'),
									alignment: 'center',
									width: 300,
									height: 300
								},
								{
									image: chartCanvases[3].toDataURL('image/png'),
									alignment: 'center',
									width: 300,
									height: 300
								},
							]
						]
					}
				}
			]
		};
		const date = datePipe.transform(new Date(), 'dd-MM-yy');
		pdf.createPdf(<TDocumentDefinitions>docDef).download('appts_charts_' + date);
	}
}
