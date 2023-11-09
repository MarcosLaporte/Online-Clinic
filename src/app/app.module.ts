import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { environment } from 'src/app/environments/environment';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { SpecialistNotEnabledComponent } from './components/specialist-not-enabled/specialist-not-enabled.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { NewAppointmentComponent } from './components/appointments/new-appointment/new-appointment.component';
import { ListAppointmentComponent } from './components/appointments/list-appointment/list-appointment.component';
import { ApptSurveyComponent } from './components/appointments/appt-survey/appt-survey.component';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		SignupComponent,
		HomeComponent,
		AccountComponent,
		EmailVerificationComponent,
		SpecialistNotEnabledComponent,
		UserListComponent,
		NewAppointmentComponent,
		ListAppointmentComponent,
		ApptSurveyComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		provideFirebaseApp(() => initializeApp(environment.firebase)),
		provideAuth(() => getAuth()),
		provideFirestore(() => getFirestore()),
		provideStorage(() => getStorage()),
		FormsModule,
		ReactiveFormsModule,
		MatDialogModule,
		BrowserAnimationsModule,
		RecaptchaModule,
	],
	providers: [
		{
			provide: RECAPTCHA_SETTINGS,
			useValue: {
				siteKey: '6LeSZAgpAAAAAHRPUZqCIcH8A67aH5hC3md1ykka',
			} as RecaptchaSettings,
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
