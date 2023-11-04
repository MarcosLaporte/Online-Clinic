import { User } from "./user";

export class Admin extends User {
	constructor(id: string = '', firstName: string, lastName: string, age: number, idNo: number, imgUrl: string, email: string, password: string) {
		super('admin', id, firstName, lastName, age, idNo, imgUrl, '', email, password);
	}
}
