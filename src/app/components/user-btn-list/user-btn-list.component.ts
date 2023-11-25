import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Admin } from 'src/app/classes/admin';
import { Patient } from 'src/app/classes/patient';
import { Specialist } from 'src/app/classes/specialist';

@Component({
	selector: 'app-user-btn-list',
	templateUrl: './user-btn-list.component.html',
	styleUrls: ['./user-btn-list.component.css']
})
export class UserBtnListComponent {
	@Input() containerClass: string = "image-div d-flex flex-column align-items-center";
	@Input() imgClass: string = 'rounded-2';
	@Input() imgWidth: string = '60px';
	@Input() imgHeight: string = 'auto';
	@Input() roleDisplay: 'none' | 'top' | 'bottom' = 'none';
	@Input() roleFs: string = '10px';
	@Input() nameDisplay: 'none' | 'top' | 'bottom' = 'none';
	@Input() nameFs: string = '10px';

	@Input() patientLimit: number = Number.MAX_SAFE_INTEGER;
	@Input() specialistLimit: number = Number.MAX_SAFE_INTEGER;
	@Input() adminLimit: number = Number.MAX_SAFE_INTEGER;

	@Input() userList: Array<Patient | Specialist | Admin> = [];
	@Output() btnPressed = new EventEmitter<Patient | Specialist | Admin>();

	protected usersToShow: Array<Patient | Specialist | Admin> = [];

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
