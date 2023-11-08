export class Survey {
	id: string;
	accessibilityGrade: number;
	attentionQualityGrade: number;
	recommendGrade: number;
	comments: string;

	constructor(id: string, accessibilityGrade: number, attentionQualityGrade: number, recommendGrade: number, comments: string) {
		this.id = id;
		this.accessibilityGrade = accessibilityGrade;
		this.attentionQualityGrade = attentionQualityGrade;
		this.recommendGrade = recommendGrade;
		this.comments = comments;
	}

}
