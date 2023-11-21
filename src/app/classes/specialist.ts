import { Specialty } from "./specialty";
import { User } from "./user";

export class Specialist extends User {
	specialties: Array<Specialty>;
	isEnabled: boolean;
	workingDays: Array<number>;
	shiftStart: string = '08:30';
	shiftEnd: string = '18:30';

	constructor(id: string = '', firstName: string, lastName: string, age: number, idNo: number, imgUrl: string, email: string, password: string, specialties: Array<Specialty>, isEnabled: boolean, workingDays: Array<number>, shiftStart: string = '08:30', shiftEnd: string = '18:30') {
		super('specialist', id, firstName, lastName, age, idNo, imgUrl, '', email, password);
		this.specialties = specialties;
		this.isEnabled = isEnabled;
		this.workingDays = workingDays;
		this.shiftStart = shiftStart;
		this.shiftEnd = shiftEnd;
	}
}
