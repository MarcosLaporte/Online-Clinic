import { UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Admin } from 'src/app/classes/admin';
import { Patient } from 'src/app/classes/patient';
import { Specialist } from 'src/app/classes/specialist';
import { InputSwal, Loader, StringIdValuePair, ToastError, ToastInfo } from 'src/app/environments/environment';
import { NotLoggedError } from 'src/app/errors/not-logged-error';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
const uppercasePipe = new UpperCasePipe();

@Component({
	selector: 'app-new-account-template',
	templateUrl: './new-account-template.component.html',
	styleUrls: ['./new-account-template.component.css']
})
export class NewAccountTemplateComponent {
	signUpForm: FormGroup;

	protected healthCarePlans: Array<StringIdValuePair> = [];
	protected specialties: Array<StringIdValuePair> = [];
	imgFile1: File | undefined;
	imgFile2: File | undefined;
	imgFile1Label: string = 'Choose an image';
	imgFile2Label: string = 'Choose second image';
	private recaptcha: string = '';

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private db: DatabaseService,
		private storage: StorageService,
		private auth: AuthService
	) {
		this.signUpForm = fb.group({
			role: 'specialist',
			firstName: [
				'',
				[
					Validators.required,
					Validators.pattern(/[\p{L}\p{M}]+/u),
				]
			],
			lastName: [
				'',
				[
					Validators.required,
					Validators.pattern(/[\p{L}\p{M}]+/u),
				]
			],
			age: [
				0,
				[
					Validators.required,
					Validators.min(0),
					Validators.max(125),
					this.specAgeValidator,
				]
			],
			idNo: [
				'',
				[
					Validators.required,
					Validators.pattern(/^\d{8}/),
				]
			],
			hcp: null,
			specialties: [
				[],
				[
					Validators.minLength(1)
				],
			],
			workingDays: [
				{ value: [], disabled: true },
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
		this.db.listenColChanges<StringIdValuePair>('specialties', this.specialties, undefined, (h1, h2) => h1.value > h2.value ? 1 : -1);
		this.db.listenColChanges<StringIdValuePair>('healthCarePlans', this.healthCarePlans, undefined, (h1, h2) => h1.value > h2.value ? 1 : -1);
	}

	private passwordMatchValidator(control: AbstractControl): null | object {
		const password = <string>control.parent?.value.password;
		const passCheck = <string>control.value;

		if (password !== passCheck)
			return { passwordMismatch: true };

		return null;
	}

	private specAgeValidator(control: AbstractControl): null | object {
		const role = <string>control.parent?.value.role;
		const age = <number>control.value;

		if (role === 'specialist' && age < 18)
			return { invalidAge: true };

		return null;
	}

	protected roleChange() {
		const hcp = this.signUpForm.get('hcp');
		const specs = this.signUpForm.get('specialties');
		const workingDays = this.signUpForm.get('workingDays');
		hcp?.setValue(null);
		specs?.setValue([]);
		workingDays?.setValue([]);

		if (this.signUpForm.get('role')?.value === 'patient') {
			hcp?.enable();
			hcp?.addValidators(Validators.required);
			specs?.clearValidators();
			specs?.disable();
			workingDays?.clearValidators();
			workingDays?.disable();
		} else {
			hcp?.clearValidators();
			hcp?.disable();
			specs?.enable();
			specs?.addValidators(Validators.required);
			workingDays?.enable();
			workingDays?.addValidators(Validators.required);
		}

		hcp?.updateValueAndValidity();
		specs?.updateValueAndValidity();
		workingDays?.updateValueAndValidity();
	}

	protected async addNewSpecialty() {
		const newSpecialty: SweetAlertResult<string> | undefined =
			await InputSwal.fire({ input: 'text', inputLabel: "Add new specialty." });

		if (newSpecialty?.value)
			await this.db.addDataAutoId('specialties', { value: newSpecialty.value });
		else
			ToastError.fire('Operation cancelled.');
	}

	imgsUploaded(): boolean {
		const role = this.signUpForm.get('role')?.value;
		if (role === 'patient')
			return this.imgFile1 instanceof File && this.imgFile2 instanceof File;
		else if (role === 'specialist')
			return this.imgFile1 instanceof File;
		else
			return true;
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

	onWorkDayClick($event: any) {
		const dayNum = parseInt($event.target.value);
		const checked = $event.target.checked;
		const formControl = this.signUpForm.get('workingDays');
		const auxArray: Array<number> = (formControl?.value).sort((n: number, m: number) => n - m);

		if (checked)
			auxArray.push(dayNum);
		else {
			const index = auxArray.indexOf(dayNum);
			auxArray.splice(index, 1);
		}

		formControl?.setValue(auxArray.sort((n, m) => n - m));
	}

	handleCaptchaResponse(response: string) {
		this.recaptcha = response;
	}

	async signUp() {
		if (!this.recaptcha) {
			ToastError.fire('Resolve the Captcha');
			return;
		}

		Loader.fire();
		await this.constructUser()
			.then(async user => {
				await this.auth.createAccount(user);
				this.router.navigateByUrl(this.auth.urlRedirect);
			})
			.catch((error: any) => {
				if (error instanceof NotLoggedError)
					this.router.navigateByUrl('login');
				else if (error.code === 'auth/email-already-in-use')
					error.message = 'This email is already registered.';

				ToastError.fire({ title: 'Oops...', text: error.message });
			});
		Loader.close();
	}

	private async constructUser(): Promise<Patient | Specialist | Admin> {
		if (!(this.imgFile1 instanceof File)) throw new Error(`There's been a problem with the image.`);
		const role: string = this.signUpForm.get('role')?.value;

		const idNo: number = parseInt(this.signUpForm.get('idNo')?.value);
		const firstName: string = uppercasePipe.transform(this.signUpForm.get('firstName')?.value);
		const lastName: string = uppercasePipe.transform(this.signUpForm.get('lastName')?.value);
		const age: number = this.signUpForm.get('age')?.value;
		const email: string = this.signUpForm.get('email')?.value;
		const password: string = this.signUpForm.get('password')?.value;

		const imgUrl1 = await this.storage.uploadImage(this.imgFile1, `users/${idNo}`);
		let user: Patient | Specialist | Admin;
		if (role === 'patient') {
			const hcp: StringIdValuePair = this.signUpForm.get('hcp')?.value;
			if (!(this.imgFile2 instanceof File)) throw new Error(`There's been a problem with the second image.`);
			const imgUrl2 = await this.storage.uploadImage(this.imgFile2, `users/${idNo}-2`);

			user = new Patient('', firstName, lastName, age, idNo, imgUrl1, imgUrl2, email, password, hcp);
		} else {
			const specialties: Array<StringIdValuePair> = this.signUpForm.get('specialties')?.value;
			const workingDays: Array<number> = this.signUpForm.get('workingDays')?.value;
			user = new Specialist('', firstName, lastName, age, idNo, imgUrl1, email, password, specialties, false, workingDays);
		}

		return user;
	}
}
