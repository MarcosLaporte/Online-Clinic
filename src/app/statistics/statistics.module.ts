import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { NgChartsModule } from 'ng2-charts';
import { LogsComponent } from './logs/logs.component';
import { ChartComponent } from './chart/chart.component';
import { StatsComponent } from './stats/stats.component';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [
		LogsComponent,
		ChartComponent,
		StatsComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		StatisticsRoutingModule,
		NgChartsModule,
	]
})
export class StatisticsModule { }
