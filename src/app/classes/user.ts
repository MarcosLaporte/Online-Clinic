export class User {
	role: 'patient' | 'specialist' | 'admin';
	id: string;
	firstName: string;
	lastName: string;
	age: number;
	idNo: number;
	imgUrl1: string;
	imgUrl2: string;
	email: string;
	password: string;

	protected constructor(role: 'patient' | 'specialist' | 'admin', id: string = '', firstName: string, lastName: string, age: number, idNo: number, imgUrl1: string, imgUrl2: string, email: string, password: string) {
		this.role = role;
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.age = age;
		this.idNo = idNo;
		this.imgUrl1 = imgUrl1;
		this.imgUrl2 = imgUrl2;
		this.email = email;
		this.password = password;
	}
}