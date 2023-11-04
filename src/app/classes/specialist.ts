import { User } from "./user";

export class Specialist extends User {
	specialty: string;
	approved: boolean;

	constructor(id: string = '', firstName: string, lastName: string, age: number, idNo: number, imgUrl: string, email: string, password: string, specialty: string, approved: boolean) {
		super('specialist', id, firstName, lastName, age, idNo, imgUrl, '', email, password);
		this.specialty = specialty;
		this.approved = approved;
	}
}
