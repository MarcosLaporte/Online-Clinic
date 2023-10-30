export class User {
	firstName: string;
	lastName: string;
	age: number;
	idNo: number;
	imgUrl1: string;
	imgUrl2: string;
	email: string;
	password: string;
	role: 'patient' | 'specialist';

	protected constructor(role: 'patient' | 'specialist', firstName: string, lastName: string, age: number, idNo: number, imgUrl1: string, imgUrl2: string, email: string, password: string) {
		this.role = role;
		this.firstName = firstName;
		this.lastName = lastName;
		this.age = age;
		this.idNo = idNo;
		this.imgUrl1 = imgUrl1;
		this.imgUrl2 = imgUrl2;
		this.email = email;
		this.password = password;
		this.email = email;
		this.password = password;
	}
}