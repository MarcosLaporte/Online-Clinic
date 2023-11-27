import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogsComponent } from './logs/logs.component';
import { StatsComponent } from './stats/stats.component';

const routes: Routes = [
	{
		path: 'logs',
		component: LogsComponent
	},
	{
		path: 'charts',
		component: StatsComponent
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
