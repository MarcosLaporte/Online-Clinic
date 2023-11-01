import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from 'src/app/classes/patient';
import { Specialist } from 'src/app/classes/specialist';
import { Loader } from 'src/app/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
	signUpForm: FormGroup;

	protected healthCarePlans: Array<{ id: string, value: string }> = [];
	protected specialties: Array<{ id: string, value: string }> = [];
	imgFile1: File | undefined;
	imgFile2: File | undefined;
	imgFile1Label: string = 'Choose an image';
	imgFile2Label: string = 'Choose second image';

	constructor(private router: Router, private auth: AuthService, private fb: FormBuilder, private db: DatabaseService, private storage: StorageService) {
		this.signUpForm = fb.group({
			roleToggle: [true],
			firstName: ['',
				[
					Validators.required,
					Validators.pattern(/^[a-z/A-Z]/),
				]
			],
			lastName: ['',
				[
					Validators.required,
					Validators.pattern(/^[a-z/A-Z]/),
				]
			],
			age: [0,
				[
					Validators.required,
					Validators.min(0),
					Validators.max(125),
				]
			],
			idNo: [
				'',
				[
					Validators.required,
					Validators.pattern(/^\d{8}/),
				]
			],
			select: [
				'',
				[
					Validators.required,
				]
			],
			email: [
				'',
				[
					Validators.required,
					Validators.email,
				]
			],
			password: [
				'',
				[
					Validators.required,
					Validators.minLength(6),
					Validators.maxLength(20),
				]
			],
			passCheck: [
				'',
				[
					Validators.required,
					this.passwordMatchValidator,
				]
			],
		});
	}

	async ngOnInit() {
		Loader.fire();
		this.healthCarePlans = await this.db.getData<{ id: string, value: string }>('healthCarePlans');
		this.specialties = await this.db.getData<{ id: string, value: string }>('specialties');
		Loader.close();
	}

	private passwordMatchValidator(control: AbstractControl): null | object {
		const password = control.parent?.value.password;
		const passCheck = <string>control.value;

		if (password !== passCheck)
			return { passwordMismatch: true };

		return null;
	}

	protected roleChange() {
		this.signUpForm.patchValue({ select: '' });
	}

	protected onSelectionChange(event: Event, formControl: string) {
		const value = (event.target as HTMLSelectElement).value;
		this.signUpForm.get(formControl)?.setValue(value);
	}

	imgsUploaded(): boolean {
		const isPatient = this.signUpForm.get('roleToggle')?.value;
		if (isPatient)
			return this.imgFile1 instanceof File && this.imgFile2 instanceof File;
		else
			return this.imgFile1 instanceof File;
	}

	imgUpload($event: any) {
		const auxFile: File = $event.target.files[0];
		if (!auxFile.type.startsWith('image')) {
			Swal.fire('Oops...', 'You must choose an image type file.', 'error');
			return;
		}

		if ($event.target.id == 'img1') {
			this.imgFile1Label = auxFile.name;
			this.imgFile1 = auxFile;
		}
		else if ($event.target.id == 'img2') {
			this.imgFile2Label = auxFile.name;
			this.imgFile2 = auxFile;
		}
	}

	async signUp() {
		if (!(this.imgFile1 instanceof File)) {
			Swal.fire('Oops...', `There's been a problem with the image.`, 'error');
			return;
		};

		const isPatient: boolean = this.signUpForm.get('roleToggle')?.value;

		const idNo: number = parseInt(this.signUpForm.get('idNo')?.value);
		const firstName: string = this.signUpForm.get('firstName')?.value;
		const lastName: string = this.signUpForm.get('lastName')?.value;
		const age: number = this.signUpForm.get('age')?.value;
		const email: string = this.signUpForm.get('email')?.value;
		const password: string = this.signUpForm.get('password')?.value;
		const selectValue: string = this.signUpForm.get('select')?.value;
		let imgUrl1: string = '';
		let imgUrl2: string = '';

		Loader.fire();
		try {
			imgUrl1 = await this.storage.uploadImage(this.imgFile1, `users/${idNo}`);
		} catch (error: any) {
			Swal.fire('Oops...', error.message, 'error');
			return;
		}

		if (isPatient) {
			if (!(this.imgFile2 instanceof File)) {
				Swal.fire('Oops...', `There's been a problem with the second image.`, 'error');
				return;
			};

			try {
				imgUrl2 = await this.storage.uploadImage(this.imgFile1, `users/${idNo}-2`);
			} catch (error: any) {
				Swal.fire('Oops...', error.message, 'error');
				return;
			}

			await this.auth.saveUser<Patient>(new Patient('', firstName, lastName, age, idNo, imgUrl1, imgUrl2, email, password, selectValue))
				.catch(async (error) => {
					Swal.fire('Oops...', error.message, 'error');
					return;
				});
		}
		else {
			await this.auth.saveUser<Specialist>(new Specialist('', firstName, lastName, age, idNo, imgUrl1, email, password, selectValue))
				.catch(async (error) => {
					Swal.fire('Oops...', error.message, 'error');
					return;
				});
		}

		this.auth.signIn(email, password);
		Loader.close();
		this.router.navigateByUrl('home');
	}
}
