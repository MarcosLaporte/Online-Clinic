import { Component, Input, EventEmitter, Output } from '@angular/core';
import { User } from 'src/app/classes/user';

export interface UserListConfig {
	containerClasses: string,
	userBtnClasses: string,
	roleDisplay: 'none' | 'top' | 'bottom',
	nameDisplay: 'none' | 'top' | 'bottom',
	patientAmount: number,
	specialistAmount: number,
	adminAmount: number,
}

@Component({
	selector: 'app-user-btn-list',
	templateUrl: './user-btn-list.component.html',
	styleUrls: ['./user-btn-list.component.css']
})
export class UserBtnListComponent {
	@Input() config: UserListConfig = {
		containerClasses: "image-div d-flex flex-column align-items-center",
		userBtnClasses: 'rounded-2',
		roleDisplay: 'none',
		nameDisplay: 'none',
		patientAmount: Number.MAX_SAFE_INTEGER,
		specialistAmount: Number.MAX_SAFE_INTEGER,
		adminAmount: Number.MAX_SAFE_INTEGER,
	};

	@Input() userList: Array<User> = [];
	@Output() btnPressed = new EventEmitter<User>();

	protected usersToShow: Array<User> = [];

	ngOnInit() {
		let filteredPatients = this.userList.filter((user) => user.role === 'patient');
		let filteredSpecialists = this.userList.filter((user) => user.role === 'specialist');
		let filteredAdmins = this.userList.filter((user) => user.role === 'admin');

		filteredPatients = this.config.patientAmount! > 0 ? filteredPatients.slice(0, this.config.patientAmount) : [];
		filteredSpecialists = this.config.specialistAmount! > 0 ? filteredSpecialists.slice(0, this.config.specialistAmount) : [];
		filteredAdmins = this.config.adminAmount! > 0 ? filteredAdmins.slice(0, this.config.adminAmount) : [];

		this.usersToShow = [...filteredPatients, ...filteredSpecialists, ...filteredAdmins];
	}
}
