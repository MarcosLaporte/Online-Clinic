import { Injectable } from '@angular/core';
import { Auth, User as FireUser, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import { User } from '../classes/user';
import { DatabaseService } from './database.service';
import { NoUserLoggedError } from '../errors/no-user-logged-error';
import { Specialist } from '../classes/specialist';
const userPath = 'users';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	constructor(private auth: Auth, private db: DatabaseService) { }

	/* async getCurrentFireUser() {
		await this.auth.currentUser?.reload();
		return this.auth.currentUser;
	} */

	async getLoggedUser(): Promise<User | null> {
		// const user = await this.getCurrentFireUser().then((user) => { return user });
		if (this.auth.currentUser && this.auth.currentUser.email) {
			return this.searchUserByEmail(this.auth.currentUser.email)
				.then((user) => { return user });
		}

		return null;
	}

	async createAccount<T extends User>(user: T): Promise<UserCredential> {
		try {
			const index = await this.idNoIndex(user.idNo);
			if (index !== -1) throw new Error('This ID is already registered.');

			const userCredential = await createUserWithEmailAndPassword(this.auth, user.email, user.password);
			await this.db.addDataAutoId(userPath, user);

			return userCredential;
		} catch (error: any) {
			if (error.code === 'auth/email-already-in-use') {
				throw new Error('This email address is already registered.');
			} else {
				throw error;
			}
		}
	}

	async signInToFirebase(email: string, pass: string) {
		return signInWithEmailAndPassword(this.auth, email, pass)
			.then(async (userCredential) => {
				const user = await this.searchUserByEmail(email);
				if (user.role == 'specialist' && !(user as Specialist).approved)
					throw new Error('Your account has not been approved yet.');

				this.db.addData('logs', { email: email, role: user.role, log: new Date() });
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

	signOut() {
		if (this.auth.currentUser === null) throw new NoUserLoggedError("No user logged in.");

		return this.auth.signOut();
	}

	sendEmailVerif() {
		const user = this.auth.currentUser;
		if (user === null) throw new NoUserLoggedError("No user logged in.");

		return sendEmailVerification(user);
	}

	async isUserVerified(): Promise<boolean> {
		await this.auth.currentUser?.reload();
		const emailVerified = this.auth.currentUser?.emailVerified;
		if (emailVerified === undefined) throw new NoUserLoggedError("No user logged in.");

		return emailVerified;
	}

	async searchUserByEmail<T extends User>(email: string): Promise<T> {
		const arrayUsers = await this.db.getData<T>(userPath);
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
}
