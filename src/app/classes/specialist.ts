import { User } from "./user";

export class Specialist extends User {
	specialty: string;

	constructor(id: string = '', firstName: string, lastName: string, age: number, idNo: number, imgUrl: string, email: string, password: string, specialty: string) {
		super('specialist', id, firstName, lastName, age, idNo, imgUrl, '', email, password);
		this.specialty = specialty;
	}
}
