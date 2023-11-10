import { Injectable } from '@angular/core';
import { Auth, User as FireUser, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateCurrentUser } from '@angular/fire/auth';
import { User } from '../classes/user';
import { DatabaseService } from './database.service';
import { Specialist } from '../classes/specialist';
import { Loader } from '../environments/environment';
import { NotLoggedError } from '../errors/not-logged-error';
const userPath = 'users';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private _loggedUser: User | null = null;
	private _isEmailVerified: boolean = false;
	private _respectiveUrl: string = 'login'; //Url to be redirected depending on user status

	public get LoggedUser(): User | null {
		return this._loggedUser;
	}
	public get IsEmailVerified(): boolean {
		return this._isEmailVerified;
	}
	public get IsUserValid(): boolean {
		return this.isFullyValidUser();
	}
	public get RespectiveUrl(): string {
		return this._respectiveUrl;
	}

	constructor(private auth: Auth, private db: DatabaseService) {
		this.getFireUser()
			.then(fireUser => {
				if (fireUser) {
					this.searchUserByEmail(fireUser.email!)
						.then(user => this._loggedUser = user);
					this._isEmailVerified = fireUser?.emailVerified!;
				}
				this.getRespectiveUserUrl()
					.then(url => this._respectiveUrl = url);
			})
	}

	async getFireUser(): Promise<FireUser | null> {
		await this.auth.currentUser?.reload();
		return this.auth.currentUser;
	}

	async updateLoggedUser(): Promise<void> {
		Loader.fire('Getting user data...');
		const fireUser = await this.getFireUser();
		if (fireUser) {
			this.searchUserByEmail(fireUser.email!)
				.then(user => {
					this._loggedUser = user;
					Loader.close();
				});
		}
	}

	createAccount<T extends User>(user: T, fireUser: FireUser | null): Promise<UserCredential> {
		try {
			return this.idNoIndex(user.idNo).then(index => {
				if (index !== -1) throw new Error('This ID is already registered.');

				return createUserWithEmailAndPassword(this.auth, user.email, user.password)
					.then(async userCredential => {
						await this.db.addDataAutoId(userPath, user);
						this.db.addData('logs', { email: user.email, role: user.role, log: new Date() });
						this.sendEmailVerif();

						if (!fireUser) {
							this._loggedUser = user;
							this._isEmailVerified = false;
							this._respectiveUrl = 'home';
						} else this.auth.updateCurrentUser(fireUser);

						return userCredential;
					});
			});

		} catch (error: any) {
			if (error.code === 'auth/email-already-in-use') {
				throw new Error('This email address is already registered.');
			} else {
				throw error;
			}
		}
	}

	async signInToFirebase(email: string, pass: string) {
		try {
			const userCred = await signInWithEmailAndPassword(this.auth, email, pass);
			this._loggedUser = await this.searchUserByEmail(email);
			this._isEmailVerified = (await this.getFireUser())!.emailVerified!;
			this._respectiveUrl = 'home';

			this.db.addData('logs', { email: email, role: this.LoggedUser!.role, log: new Date() });

			if (!this.IsEmailVerified) {
				this._respectiveUrl = 'account-verification';
				throw new Error('You have to verify your email.');
			}

			if (this.LoggedUser!.role == 'specialist' && !(this.LoggedUser as Specialist).isEnabled) {
				this._respectiveUrl = 'specialist-enabling';
				throw new Error('Your account has not been enabled yet.');
			}

			return userCred;
		} catch (error: any) {
			if (error.code === 'auth/invalid-login-credentials') {
				this._respectiveUrl = 'login';
				throw new Error(`Credentials don't match.`);
			} else {
				throw error;
			}
		}
	}

	signOut() {
		if (this.auth.currentUser === null) throw new NotLoggedError;

		this._loggedUser = null;
		this._isEmailVerified = false;
		this._respectiveUrl = 'login';
		return this.auth.signOut();
	}

	sendEmailVerif() {
		const user = this.auth.currentUser;
		if (user === null) throw new NotLoggedError;

		return sendEmailVerification(user);
	}

	async isUserVerified(): Promise<boolean> {
		const fireUser = await this.getFireUser();

		if (fireUser) {
			this._isEmailVerified = fireUser.emailVerified;

			return this.IsEmailVerified;
		}

		throw new NotLoggedError;
	}

	async isSpecialistEnabled(): Promise<boolean> {
		await this.updateLoggedUser();
		if (this._loggedUser?.role !== 'specialist') throw new Error("User is not specialist.");

		return (this._loggedUser as Specialist).isEnabled;
	}

	isFullyValidUser(): boolean {
		if (!this.LoggedUser || !this.IsEmailVerified) {
			return false;
		}

		if (this.LoggedUser.role === 'specialist') {
			return (this.LoggedUser as Specialist).isEnabled;
		}

		return true;
	}

	async getRespectiveUserUrl() {
		if (this.LoggedUser !== null) {
			if (this.IsEmailVerified) {
				if (this.LoggedUser.role === 'specialist' && !(this.LoggedUser as Specialist).isEnabled) {
					return 'specialist-enabling';
				}
			}
			return 'account-verification'
		}

		return 'home';
	}

	async searchUserByEmail(email: string): Promise<User> {
		const arrayUsers = await this.db.getData<User>(userPath);
		const index = arrayUsers.findIndex(u => u.email === email);
		if (index === -1) throw new Error('This email address is not registered.');

		return arrayUsers[index];
	}

	async searchUserByIdNo(idNo: number): Promise<User> {
		const arrayUsers = await this.db.getData<User>(userPath);
		const index = arrayUsers.findIndex(u => u.idNo === idNo);
		if (index === -1) throw new Error('This id number is not registered.');

		return arrayUsers[index];
	}

	private async idNoIndex(idNo: number): Promise<number> {
		const arrayUsers = await this.db.getData<User>(userPath);
		return arrayUsers.findIndex((u) => u.idNo === idNo);
	}
}
