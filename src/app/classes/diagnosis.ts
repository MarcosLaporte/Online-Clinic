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

	static getData(diag: Diagnosis): string {
		return `Height: ${diag?.height}cm
Weight: ${diag?.weight}kg
Temperature: ${diag?.tempC}°C
Blood pressure: ${diag?.pressure} mmHg
${diag?.additionalData[0].key}: '${diag?.additionalData[0].value}'
${diag?.additionalData[1].key}: '${diag?.additionalData[1].value}'
${diag?.additionalData[2].key}: '${diag?.additionalData[2].value}'`;
	}
}