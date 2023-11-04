import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { AccountComponent } from './components/account/account.component';

const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: 'account-verification', component: EmailVerificationComponent },
	{ path: 'account', component: AccountComponent },
	{ path: 'departments', component: HomeComponent },
	{ path: 'doctors', component: HomeComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
