export class Survey {
	id: string;
	attentionQualityGrade: number;
	accessibilityGrade: number;
	recommendGrade: number;
	comments: string;

	constructor(id: string = '', attentionQualityGrade: number, accessibilityGrade: number, recommendGrade: number, comments: string) {
		this.id = id;
		this.attentionQualityGrade = attentionQualityGrade;
		this.accessibilityGrade = accessibilityGrade;
		this.recommendGrade = recommendGrade;
		this.comments = comments;
	}
}
