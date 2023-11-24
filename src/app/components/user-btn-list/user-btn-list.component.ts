import { Component, Input, EventEmitter, Output } from '@angular/core';
import { User } from 'src/app/classes/user';

@Component({
	selector: 'app-user-btn-list',
	templateUrl: './user-btn-list.component.html',
	styleUrls: ['./user-btn-list.component.css']
})
export class UserBtnListComponent {
	@Input() containerClasses :string = "image-div d-flex flex-column align-items-center";
	@Input() userBtnClasses :string = 'rounded-2';
	@Input() roleDisplay: 'none' | 'top' | 'bottom' = 'none';
	@Input() nameDisplay: 'none' | 'top' | 'bottom' = 'none';
	@Input() patientLimit: number = Number.MAX_SAFE_INTEGER;
	@Input() specialistLimit: number = Number.MAX_SAFE_INTEGER;
	@Input() adminLimit: number = Number.MAX_SAFE_INTEGER;

	@Input() userList: Array<User> = [];
	@Output() btnPressed = new EventEmitter<User>();

	protected usersToShow: Array<User> = [];

	ngOnInit() {
		let filteredPatients = this.userList.filter((user) => user.role === 'patient');
		let filteredSpecialists = this.userList.filter((user) => user.role === 'specialist');
		let filteredAdmins = this.userList.filter((user) => user.role === 'admin');

		filteredPatients = this.patientLimit! > 0 ? filteredPatients.slice(0, this.patientLimit) : [];
		filteredSpecialists = this.specialistLimit! > 0 ? filteredSpecialists.slice(0, this.specialistLimit) : [];
		filteredAdmins = this.adminLimit! > 0 ? filteredAdmins.slice(0, this.adminLimit) : [];

		this.usersToShow = [...filteredPatients, ...filteredSpecialists, ...filteredAdmins];
	}
}
