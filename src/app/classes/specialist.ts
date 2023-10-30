import { User } from "./user";

export class Specialist extends User {
	specialty: string;

	constructor(firstName: string, lastName: string, age: number, idNo: number, imgUrl1: string, email: string, password: string, specialty: string) {
		super('specialist', firstName, lastName, age, idNo, imgUrl1, '', email, password);
		this.specialty = specialty;
	}
}
