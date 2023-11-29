import { Component, Input, Output } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.css']
})
export class ChartComponent {
	@Input() width: string = 'auto';
	@Input() height: string = 'auto';

	@Input() chartId: string = 'myChart';
	@Input() chartType: ChartType = 'bar';
	@Input() chartData: ChartData = {
		labels: [],
		datasets: []
	};
	@Input() chartOptions: ChartOptions = { responsive: true };
}
