import { User } from "./user";

export class Patient extends User {
	healthPlan: string;

	constructor(id: string = '', firstName: string, lastName: string, age: number, idNo: number, imgUrl1: string, imgUrl2: string, email: string, password: string, healthPlan: string) {
		super('patient', id, firstName, lastName, age, idNo, imgUrl1, imgUrl2, email, password);
		this.healthPlan = healthPlan;
	}
}
