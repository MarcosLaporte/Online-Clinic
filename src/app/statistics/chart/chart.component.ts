import { Component, Input } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.css']
})
export class ChartComponent {
	@Input() width: string = 'auto';
	@Input() height: string = 'auto';

	@Input() chartType: ChartType = 'bar';
	@Input() chartData: ChartData | undefined;
	@Input() chartOptions: ChartOptions = {
		plugins: {
			tooltip: {
				enabled: false
			}
		}
	};
}
