export class Diagnosis {
	id: string;
	height: number;
	weight: number;
	tempC: number;
	pressure: string;
	additionalData: Array<{ key: string, value: number }>;

	constructor(id: string = '', height: number, weight: number, tempC: number, pressure: string, additionalData: Array<{ key: string, value: number }>) {
		this.id = id;
		this.height = height;
		this.weight = weight;
		this.tempC = tempC;
		this.pressure = pressure;
		this.additionalData = additionalData;
	}

	getData(): string {
		return `Height: ${this?.height}
		Weight: ${this?.weight}
		Temperature: ${this?.tempC}°C
		Blood pressure: ${this?.pressure} mmHg
		${this?.additionalData[0].key}: '${this?.additionalData[0].value}'
		${this?.additionalData[1].key}: '${this?.additionalData[1].value}'
		${this?.additionalData[2].key}: '${this?.additionalData[2].value}'`;
	}
}