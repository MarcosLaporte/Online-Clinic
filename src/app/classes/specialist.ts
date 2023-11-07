import { StringIdValuePair } from "../environments/environment";
import { User } from "./user";

export class Specialist extends User {
	specialty: StringIdValuePair;
	isEnabled: boolean;
	workingDays: Array<number>;

	constructor(id: string = '', firstName: string, lastName: string, age: number, idNo: number, imgUrl: string, email: string, password: string, specialty: StringIdValuePair, isEnabled: boolean, workingDays: Array<number>) {
		super('specialist', id, firstName, lastName, age, idNo, imgUrl, '', email, password);
		this.specialty = specialty;
		this.isEnabled = isEnabled;
		this.workingDays = workingDays;
	}
}
