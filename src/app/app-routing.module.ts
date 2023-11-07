import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { AccountComponent } from './components/account/account.component';
import { loggedGuard } from './guards/logged.guard';
import { notLoggedGuard } from './guards/not-logged.guard';
import { adminGuard } from './guards/admin.guard';
import { specEnableDeactivateGuard } from './guards/spec-enable-deactivate.guard';
import { notEnabledSpecGuard } from './guards/not-enabled-spec.guard';
import { validAccountGuard } from './guards/valid-account.guard';
import { SpecialistNotEnabledComponent } from './components/specialist-not-enabled/specialist-not-enabled.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { notSpecGuard } from './guards/not-spec.guard';
import { NewAppointmentComponent } from './components/appointments/new-appointment/new-appointment.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full'
	},
	{
		path: 'home',
		canActivate: [validAccountGuard],
		component: HomeComponent
	},
	{
		path: 'login',
		canActivate: [notLoggedGuard],
		component: LoginComponent
	},
	{
		path: 'signup',
		canActivate: [notLoggedGuard],
		component: SignupComponent
	},
	{
		path: 'account-verification',
		canActivate: [loggedGuard],
		component: EmailVerificationComponent
	},
	{
		path: 'specialist-enabling',
		canActivate: [notEnabledSpecGuard],
		canDeactivate: [specEnableDeactivateGuard],
		component: SpecialistNotEnabledComponent
	},
	{
		path: 'account',
		canActivate: [validAccountGuard],
		component: AccountComponent
	},
	{
		path: 'users',
		canActivate: [loggedGuard, adminGuard],
		component: UserListComponent
	},
	{
		path: 'new-appointment',
		canActivate: [loggedGuard, notSpecGuard],
		component: NewAppointmentComponent
	}
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
