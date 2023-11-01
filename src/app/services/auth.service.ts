import { Injectable } from '@angular/core';
import { UserCredential, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { User } from '../classes/user';
import { DatabaseService } from './database.service';
const userPath = 'users';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	//#region Subjects & Observables
	private _isLoggedSub = new BehaviorSubject<boolean>(false);
	public isLoggedObs = this._isLoggedSub.asObservable();
	public get isLogged() {
		return this._isLoggedSub.getValue();
	}
	public set isLogged(value: boolean) {
		this._isLoggedSub.next(value);
	}

	private _isAdminSub = new BehaviorSubject<boolean>(false);
	public isAdminObs = this._isAdminSub.asObservable();
	public get isAdmin() {
		return this._isAdminSub.getValue();
	}
	public set isAdmin(value: boolean) {
		this._isAdminSub.next(value);
	}

	private _loggedUserSub = new BehaviorSubject<User | undefined>(undefined);
	public loggedUserObs = this._loggedUserSub.asObservable();
	public get loggedUser() {
		return this._loggedUserSub.getValue();
	}
	public set loggedUser(value: User | undefined) {
		if (value !== undefined)
			sessionStorage.setItem('loggedUser', JSON.stringify(value));
		else
			sessionStorage.removeItem('loggedUser');

		this._loggedUserSub.next(value);
	}
	//#endregion

	constructor(private db: DatabaseService) {
		this.loggedUser = this.getUserInSession();
		this.isLogged = this.loggedUser !== undefined;
		this.isAdmin = false;
	}

	private getUserInSession(): User | undefined {
		const ss = sessionStorage.getItem('loggedUser');
		if (ss !== null)
			return JSON.parse(ss) as User;

		return undefined;
	}

	logOutFromSession() {
		this.isLogged = false;
		this.loggedUser = undefined;
		this.isAdmin = false;
	}

	async signIn(email: string, pass: string) {
		const fireAuth = getAuth();

		return signInWithEmailAndPassword(fireAuth, email, pass)
			.then(async (userCredential) => {
				const user = await this.searchUserByEmail(email);
				this.db.addData('logs', { email: email, role: user.role, log: new Date() });
				this.isLogged = true;
				this.loggedUser = user;
				return userCredential;
			})
			.catch((error) => {
				if (error.code === 'auth/invalid-login-credentials') {
					throw new Error(`Credentials don't match.`);
				} else {
					throw error;
				}
			});
	}

	private async searchUserByEmail(email: string): Promise<User> {
		const arrayUsers = await this.db.getData<User>(userPath);
		const index = await this.emailIndex(email);
		if (index === -1) throw new Error('This email address is not registered.');

		return arrayUsers[index];
	}

	private async idNoIndex(idNo: number): Promise<number> {
		const arrayUsers = await this.db.getData<User>(userPath);
		return arrayUsers.findIndex((u) => u.idNo === idNo);
	}

	private async emailIndex(email: string): Promise<number> {
		const arrayUsers = await this.db.getData<User>(userPath);
		return arrayUsers.findIndex((u) => u.email === email);
	}

	async saveUser<T extends User>(user: T): Promise<UserCredential> {
		const fireAuth = getAuth();
		this.idNoIndex(user.idNo).then((index) => {
			if (index !== -1) throw new Error('This ID is already registered.');
		})

		return createUserWithEmailAndPassword(fireAuth, user.email, user.password)
			.then((userCredential) => {
				this.db.addDataAutoId(userPath, user);
				return userCredential;
			})
			.catch((error) => {
				if (error.code === 'auth/email-already-in-use') {
					throw new Error('This email address is already registered.');
				} else {
					throw error;
				}
			});
	}

}
