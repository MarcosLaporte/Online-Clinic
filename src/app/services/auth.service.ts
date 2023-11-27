import { Injectable } from '@angular/core';
import { Auth, User as FireUser, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateCurrentUser } from '@angular/fire/auth';
import { User } from '../classes/user';
import { Specialist } from '../classes/specialist';
import { NotLoggedError } from '../errors/not-logged-error';
import { BehaviorSubject, Observable } from 'rxjs';
import { Patient } from '../classes/patient';
import { Admin } from '../classes/admin';
import { DatabaseService } from './database.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	//#region Properties, Subjects and Observables
	urlRedirect: string = 'login';

	private _loggedUserSub = new BehaviorSubject<Patient | Specialist | Admin | null>(null);
	public loggedUserObs = this._loggedUserSub.asObservable();
	public get LoggedUser(): Patient | Specialist | Admin | null {
		return this._loggedUserSub.getValue();
	}
	private set LoggedUser(value: Patient | Specialist | Admin | null) {
		this._loggedUserSub.next(value);
	}

	private _fireUserSub = new BehaviorSubject<FireUser | null>(null);
	public fireUserObs = this._fireUserSub.asObservable();
	public get FireUser(): FireUser | null {
		return this._fireUserSub.getValue();
	}
	private set FireUser(value: FireUser | null) {
		this._fireUserSub.next(value);
	}

	isEmailVerified: boolean = false;

	public get IsUserValid(): boolean {
		return this.isFullyValidUser();
	}
	//#endregion

	constructor(private auth: Auth, private db: DatabaseService) { }

	async createAccount(user: User): Promise<UserCredential> {
		const ogFireUser = this._fireUserSub.getValue();
		const ogUser = this._loggedUserSub.getValue();

		this.db.searchUserByIdNo(user.idNo)
			.then(() => { throw new Error("This id number is already registered.") })
			.catch(() => { });

		return createUserWithEmailAndPassword(this.auth, user.email, user.password)
			.then(async userCredential => {
				const newUser = this.auth.currentUser
				if (!ogFireUser) {
					this.FireUser = newUser;
					this.urlRedirect = 'home';
					this.LoggedUser = user;
					this.db.addDataAutoId('logs', { date: new Date(), user: user })
				} else { //If not null, admin is creating new account
					this.FireUser = ogFireUser;
					this.LoggedUser = ogUser;
					this.urlRedirect = 'users'
					await updateCurrentUser(this.auth, ogFireUser);
				}

				this.sendEmailVerif(newUser);
				await this.db.addDataAutoId('users', user);

				return userCredential
			});
	}

	async signInToFirebase(email: string, password: string) {
		try {
			const userCred = await signInWithEmailAndPassword(this.auth, email, password);
			this.FireUser = this.auth.currentUser;
			await this.db.searchUserByEmail(this.FireUser?.email!)
				.then(async user => {
					this.LoggedUser = user;
					this.isEmailVerified = this.FireUser!.emailVerified!;
					this.urlRedirect = 'home';
					this.db.addDataAutoId('logs', { date: new Date(), user: user })

					if (!this.isEmailVerified) {
						this.urlRedirect = 'account-verification';
						throw new Error('You have to verify your email.');
					}

					if (this.LoggedUser!.role === 'specialist' && !(this.LoggedUser as Specialist).isEnabled) {
						this.urlRedirect = 'specialist-enabling';
						throw new Error('Your account has not been enabled yet.');
					}

				});
		} catch (error: any) {
			if (error.code === 'auth/invalid-login-credentials') {
				this.urlRedirect = 'login';
				throw new Error("Credentials don't match.");
			} else {
				throw error;
			}
		}
	}

	signOut() {
		if (this.auth.currentUser === null) throw new NotLoggedError;

		this.LoggedUser = null;
		this.isEmailVerified = false;
		this.urlRedirect = 'login';
		return this.auth.signOut()
			.then(() => {
				this.auth.currentUser?.reload();
				this.FireUser = this.auth.currentUser;
			});
	}

	sendEmailVerif(afUser?: FireUser | null) {
		const user = afUser ? afUser : this.auth.currentUser;
		if (user === null) throw new NotLoggedError;

		return sendEmailVerification(user);
	}

	async checkEmailVerif(): Promise<boolean> {
		await this.auth.currentUser?.reload();
		this.FireUser = this.auth.currentUser;
		if (this.FireUser) {
			if (this.FireUser.emailVerified) {
				this.isEmailVerified = this.FireUser.emailVerified;
				this.urlRedirect = 'home';

				if (this.LoggedUser!.role === 'specialist' && !(this.LoggedUser as Specialist).isEnabled)
					this.urlRedirect = 'specialist-enabling';

				return true;
			}

			return false;
		}

		throw new NotLoggedError;
	}

	async isSpecialistEnabled(): Promise<boolean> {
		if (this.LoggedUser?.role !== 'specialist') throw new Error("User is not specialist.");

		const spec = await this.db.searchUserByIdNo(this.LoggedUser.idNo);
		this.LoggedUser = spec;
		return (spec as Specialist).isEnabled;
	}

	isFullyValidUser(): boolean {
		if (!this.LoggedUser || !this.isEmailVerified) {
			return false;
		}

		if (this.LoggedUser.role === 'specialist') {
			return (this.LoggedUser as Specialist).isEnabled;
		}

		return true;
	}
}
