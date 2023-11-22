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
import { specGuard } from './guards/spec.guard';
import { notEnabledSpecGuard } from './guards/not-enabled-spec.guard';
import { validAccountGuard } from './guards/valid-account.guard';
import { SpecialistNotEnabledComponent } from './components/specialist-not-enabled/specialist-not-enabled.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { notSpecGuard } from './guards/not-spec.guard';
import { NewAppointmentComponent } from './components/appointments/new-appointment/new-appointment.component';
import { ListAppointmentComponent } from './components/appointments/list-appointment/list-appointment.component';
import { ApptSurveyComponent } from './components/appointments/appt-survey/appt-survey.component';
import { MyPatientsComponent } from './components/my-patients/my-patients.component';
import { PatProfileComponent } from './components/pat-profile/pat-profile.component';
import { patGuard } from './guards/pat.guard';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full'
	},
	{
		path: 'home',
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
		component: SpecialistNotEnabledComponent
	},
	{
		path: 'account',
		canActivate: [loggedGuard, validAccountGuard],
		component: AccountComponent
	},
	{
		path: 'users',
		canActivate: [adminGuard, validAccountGuard],
		component: UserListComponent
	},
	{
		path: 'new-appointment',
		canActivate: [notSpecGuard, validAccountGuard],
		component: NewAppointmentComponent
	},
	{
		path: 'appointments',
		canActivate: [validAccountGuard],
		component: ListAppointmentComponent
	},
	{
		path: 'appointment-survey',
		canActivate: [validAccountGuard],
		component: ApptSurveyComponent
	},
	{
		path: 'my-patients',
		canActivate: [specGuard, validAccountGuard],
		component: MyPatientsComponent
	},
	{
		path: 'my-profile',
		canActivate: [patGuard, validAccountGuard],
		component: PatProfileComponent
	},
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
