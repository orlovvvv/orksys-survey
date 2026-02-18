interface DistributionItem {
	value: string;
	count: number;
	percentage: number;
}

export function calculateNPSScore(
	distribution: Array<{ value: string; count: number }>,
): number {
	let promoters = 0;
	let _passives = 0;
	let detractors = 0;
	let total = 0;

	for (const item of distribution) {
		const score = Number.parseInt(item.value, 10);
		if (Number.isNaN(score)) continue;

		total += item.count;
		if (score >= 9) promoters += item.count;
		else if (score >= 7) _passives += item.count;
		else detractors += item.count;
	}

	if (total === 0) return 0;

	const promoterPercent = (promoters / total) * 100;
	const detractorPercent = (detractors / total) * 100;

	return Math.round(promoterPercent - detractorPercent);
}

export const questionTypeLabels: Record<string, string> = {
	text: "Text Response",
	textarea: "Long Text",
	multiple_choice: "Multiple Choice",
	checkbox: "Checkboxes",
	dropdown: "Dropdown",
	rating: "Rating Scale",
	nps: "Net Promoter Score",
	linear_scale: "Linear Scale",
	date: "Date",
	email: "Email",
	phone: "Phone",
	file_upload: "File Upload",
};

export interface QuestionAnalytics {
	questionId: string;
	questionType: string;
	questionTitle: string;
	totalAnswers: number;
	distribution: DistributionItem[];
	average?: number;
	min?: number;
	max?: number;
	sampleResponses?: string[];
}

export interface ChartDataPoint {
	name: string;
	value: number;
}

export function transformDistributionToChartData(
	distribution: DistributionItem[],
): ChartDataPoint[] {
	return distribution.map((d) => ({
		name: d.value,
		value: d.count,
	}));
}
