import { UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Admin } from 'src/app/classes/admin';
import { Patient } from 'src/app/classes/patient';
import { Specialist } from 'src/app/classes/specialist';
import { InputSwal, Loader, StringIdValuePair, ToastError } from 'src/app/environments/environment';
import { NotLoggedError } from 'src/app/errors/not-logged-error';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

const uppercasePipe = new UpperCasePipe();
@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
	signUpForm: FormGroup;

	protected healthCarePlans: Array<StringIdValuePair> = [];
	protected specialties: Array<StringIdValuePair> = [];
	imgFile1: File | undefined;
	imgFile2: File | undefined;
	imgFile1Label: string = 'Choose an image';
	imgFile2Label: string = 'Choose second image';
	newOption: string = '';
	allowAddNew: boolean = true;
	private recaptcha: string = '';

	constructor(private router: Router, private auth: AuthService, private fb: FormBuilder, private db: DatabaseService, private storage: StorageService) {
		this.signUpForm = fb.group({
			roleRadio: ['patient'],
			firstName: [
				'',
				[
					Validators.required,
					Validators.pattern(/^[a-zA-Z]+$/),
				]
			],
			lastName: [
				'',
				[
					Validators.required,
					Validators.pattern(/^[a-zA-Z]+$/),
				]
			],
			age: [
				0,
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
				null,
				[
					Validators.required,
				]
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
		let auxArray = [];
		Loader.fire();
		auxArray = await this.db.getData<StringIdValuePair>('healthCarePlans');
		this.healthCarePlans = auxArray.sort((h1, h2) => h1.value > h2.value ? 1 : -1);

		auxArray = await this.db.getData<StringIdValuePair>('specialties');
		this.specialties = auxArray.sort((s1, s2) => s1.value > s2.value ? 1 : -1);
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
		const select = this.signUpForm.get('select');
		const workingDays = this.signUpForm.get('workingDays');
		select?.setValue(null);
		workingDays?.setValue([]);

		const role: string = this.signUpForm.get('roleRadio')?.value;
		switch (role) {
			case 'admin':
				select?.clearValidators();
				workingDays?.clearValidators();
				workingDays?.disable();
				break;
			case 'patient':
				select?.addValidators(Validators.required);
				workingDays?.clearValidators();
				workingDays?.disable();
				break;
			case 'specialist':
				select?.addValidators(Validators.required);
				workingDays?.addValidators(Validators.required);
				break;
		}

		select?.updateValueAndValidity();
	}

	protected async onSelectionChange(event: Event, formControl: string) {
		let value: string | null = (event.target as HTMLSelectElement).value;
		if (formControl === 'specialty') {
			this.signUpForm.controls['workingDays'].enable();
			if (value === 'addNew') {
				this.allowAddNew = false;
				const newSpecialty: SweetAlertResult<string> | undefined =
					await InputSwal.fire({ input: 'text', inputLabel: "Add new specialty." });

				if (newSpecialty?.value) {
					const docId = this.db.addDataAutoId('specialties', { value: newSpecialty.value });
					value = docId;
					this.specialties = await this.db.getData('specialties');
				} else {
					ToastError.fire('Operation cancelled.');
					value = null;
				}
			}
		}

		this.signUpForm.get(formControl)?.patchValue(value);
		this.allowAddNew = true;
	}

	imgsUploaded(): boolean {
		const role = this.signUpForm.get('roleRadio')?.value;
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

		try {
			if (!(this.imgFile1 instanceof File)) throw new Error(`There's been a problem with the image.`);
			const role: string = this.signUpForm.get('roleRadio')?.value;

			const idNo: number = parseInt(this.signUpForm.get('idNo')?.value);
			const firstName: string = uppercasePipe.transform(this.signUpForm.get('firstName')?.value);
			const lastName: string = uppercasePipe.transform(this.signUpForm.get('lastName')?.value);
			const age: number = this.signUpForm.get('age')?.value;
			const email: string = this.signUpForm.get('email')?.value;
			const password: string = this.signUpForm.get('password')?.value;
			const selectValue: StringIdValuePair = this.signUpForm.get('select')?.value;
			const workingDays: Array<number> = this.signUpForm.get('workingDays')?.value;

			Loader.fire();
			const imgUrl1 = await this.storage.uploadImage(this.imgFile1, `users/${idNo}`);
			let user: Patient | Specialist | Admin;
			if (role === 'patient') {
				if (!(this.imgFile2 instanceof File)) throw new Error(`There's been a problem with the second image.`);
				const imgUrl2 = await this.storage.uploadImage(this.imgFile2, `users/${idNo}-2`);

				user = new Patient('', firstName, lastName, age, idNo, imgUrl1, imgUrl2, email, password, selectValue);
			} else if (role === 'specialist') {
				user = new Specialist('', firstName, lastName, age, idNo, imgUrl1, email, password, selectValue, false, workingDays);
			} else {
				user = new Admin('', firstName, lastName, age, idNo, imgUrl1, email, password);
			}

			await this.auth.createAccount<typeof user>(user);
			await this.auth.sendEmailVerif();
			await this.signIn(email, password);
			Loader.close();
		} catch (error: any) {
			Swal.fire('Oops...', error.message, 'error');
		}
	}

	async signIn(email: string, pass: string) {
		try {
			await this.auth.signInToFirebase(email, pass);
			if (!(this.auth.IsEmailVerified)) throw new Error("Verify your account!");

			this.router.navigateByUrl('home');
		} catch (error: any) {
			ToastError.fire({ title: 'Oops...', text: error.message });
			if (error instanceof NotLoggedError)
				this.router.navigateByUrl('login');
			else
				this.router.navigateByUrl('account-verification');
		}
	}

}
