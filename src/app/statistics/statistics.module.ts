import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { LogsComponent } from './logs/logs.component';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [
		LogsComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		StatisticsRoutingModule,
	]
})
export class StatisticsModule { }
