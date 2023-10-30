import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp({"projectId":"la-clinica-111655","appId":"1:139443659844:web:56ea20cc0268b7afb54811","storageBucket":"la-clinica-111655.appspot.com","apiKey":"AIzaSyDhjoZlOyHYyEZqXKF8Txb2QdcBAx6eCJQ","authDomain":"la-clinica-111655.firebaseapp.com","messagingSenderId":"139443659844"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
