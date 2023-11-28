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
import { NewAccountTemplateComponent } from './components/new-account-template/new-account-template.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserBtnListComponent } from './components/user-btn-list/user-btn-list.component';
import { MyPatientsComponent } from './components/my-patients/my-patients.component';
import { PatientHistoryComponent } from './components/patient-history/patient-history.component';
import { ApptDiagnosisComponent } from './components/appointments/appt-diagnosis/appt-diagnosis.component';
import { PatProfileComponent } from './components/pat-profile/pat-profile.component';
import { ApptFilterComponent } from './components/appointments/appt-filter/appt-filter.component';
import { FormErrorDirective } from './directives/form-error.directive';
import { TooltipDirective } from './directives/tooltip.directive';
import { ScrollToTopDirective } from './directives/scroll-to-top.directive';
import { UserNamePipe } from './pipes/user-name.pipe';

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
		NewAccountTemplateComponent,
		UserBtnListComponent,
		MyPatientsComponent,
		PatientHistoryComponent,
		ApptDiagnosisComponent,
		PatProfileComponent,
		ApptFilterComponent,
		FormErrorDirective,
		TooltipDirective,
		ScrollToTopDirective,
		UserNamePipe,
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
		BrowserAnimationsModule,
		MatDialogModule,
		RecaptchaModule,
		NgSelectModule,
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
