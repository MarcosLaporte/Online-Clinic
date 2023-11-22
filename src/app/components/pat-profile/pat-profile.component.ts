import { Component, inject } from '@angular/core';
import { Appointment } from 'src/app/classes/appointment';
import { Patient } from 'src/app/classes/patient';
import { AuthService } from 'src/app/services/auth.service';
import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from "node_modules/@types/pdfmake/interfaces.js";
import { DatePipe } from '@angular/common';
import { Diagnosis } from 'src/app/classes/diagnosis';

const datePipe = new DatePipe('en-US', '-0300');
const pdf = pdfMake;
pdf.vfs = pdfFonts.pdfMake.vfs;
@Component({
	selector: 'app-pat-profile',
	templateUrl: './pat-profile.component.html',
	styleUrls: ['./pat-profile.component.css']
})
export class PatProfileComponent {
	readonly user: Patient;

	constructor() {
		this.user = <Patient>inject(AuthService).LoggedUser;
	}

	async downloadPDF(history: Array<Appointment>) {
		const date = new Date();
		const docDef = {
			pageSize: 'A4',
			pageOrientation: 'landscape',
			header: {
				columns: [
					{ text: datePipe.transform(date, 'longDate'), margin: [15, 15, 0, 0], alignment: 'left' },
					{
						image: await this.getBase64ImageFromURL('https://cdn-icons-png.flaticon.com/512/4434/4434378.png'),
						fit: [25, 25],
						margin: [15, 15, 0, 0],
						alignment: 'right'
					}
				]
			},
			content: [
				{ text: 'Medical History', fontSize: 18, bold: true, decoration: 'underline', alignment: 'center', margin: [0, 5, 0, 5] },
				{ text: `${this.user.firstName} ${this.user.lastName}, ${this.user.idNo}`, fontSize: 14, italics: true, alignment: 'center', margin: [0, 5, 0, 30] },
				{
					layout: 'lightHorizontalLines',
					table: {
						headerRows: 1,
						widths: [100, 150, 100, 125, '*'],
						body: this.parseAppointments(history)
					}
				}
			],
		};

		pdf.createPdf(<TDocumentDefinitions>docDef).download(`${this.user.idNo}_medical_history.pdf`);
	}

	parseAppointments(appts: Array<Appointment>): Array<Array<any>> {
		let bodyRows: Array<Array<any>> = [
			[
				{ text: 'Date', bold: true, fontSize: 13 },
				{ text: 'Specialty', bold: true, fontSize: 13 },
				{ text: 'Specialist', bold: true, fontSize: 13 },
				{ text: "Specialist's review", bold: true, fontSize: 13 },
				{ text: 'Diagnostic', bold: true, fontSize: 13 }
			]
		];
		for (const appt of appts) {
			const row: Array<any> = [
				{ text: datePipe.transform(appt.date, 'YYYY/MM/dd, HH:mm')! + 'hs' },
				{ text: appt.specialty.value, italics: true },
				`${appt.specialist.lastName}, ${appt.specialist.firstName}`,
				appt.specReview,
				Diagnosis.getData(appt.diagnosis!),
			]

			bodyRows.push(row);
		}

		return bodyRows;
	}

	private getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

}
