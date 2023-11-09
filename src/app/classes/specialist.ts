import { StringIdValuePair } from "../environments/environment";
import { User } from "./user";

export class Specialist extends User {
	specialty: StringIdValuePair;
	isEnabled: boolean;
	workingDays: Array<number>;
	shiftStart: string = '08:30';
	shiftEnd: string = '18:30';

	constructor(id: string = '', firstName: string, lastName: string, age: number, idNo: number, imgUrl: string, email: string, password: string, specialty: StringIdValuePair, isEnabled: boolean, workingDays: Array<number>, shiftStart: string = '08:30', shiftEnd: string = '18:30') {
		super('specialist', id, firstName, lastName, age, idNo, imgUrl, '', email, password);
		this.specialty = specialty;
		this.isEnabled = isEnabled;
		this.workingDays = workingDays;
		this.shiftStart = shiftStart;
		this.shiftEnd = shiftEnd;
	}
}
