import type { Question } from "@orksys-survey/db";

import { BarChart } from "@/components/charts/bar-chart";
import { NpsGauge, RatingDisplay } from "@/components/charts/nps-gauge";
import { PieChart, PieChartLegend } from "@/components/charts/pie-chart";

import type { ChartDataPoint, QuestionAnalytics } from "./utils";

interface ChartRendererProps {
	questionAnalytics: QuestionAnalytics;
	question: Question;
}

export function ChartRenderer({
	questionAnalytics,
	question,
}: ChartRendererProps) {
	const chartData: ChartDataPoint[] = questionAnalytics.distribution.map(
		(d) => ({
			name: d.value,
			value: d.count,
		}),
	);

	// Chart choice based on question type
	if (question.type === "nps") {
		const npsScore = calculateNPSScore(questionAnalytics.distribution);
		return (
			<div className="flex flex-col items-center gap-4">
				<NpsGauge score={npsScore} size="lg" />
				<div className="text-center">
					<p className="font-medium text-muted-foreground text-sm">
						Net Promoter Score
					</p>
					<p className="text-muted-foreground text-xs">
						Based on {questionAnalytics.totalAnswers} responses
					</p>
				</div>
			</div>
		);
	}

	if (question.type === "rating" || question.type === "linear_scale") {
		return (
			<div className="space-y-4">
				{questionAnalytics.average !== undefined && (
					<RatingDisplay
						value={questionAnalytics.average}
						max={(question.config?.max as number) || 5}
					/>
				)}
				<BarChart
					data={chartData}
					height={200}
					showGrid={false}
					formatter={(value) => `${value} responses`}
				/>
			</div>
		);
	}

	if (question.type === "multiple_choice" || question.type === "dropdown") {
		return (
			<div className="flex flex-col items-center gap-4">
				<PieChart data={chartData} height={250} outerRadius={90} />
				<PieChartLegend data={chartData} />
			</div>
		);
	}

	if (question.type === "checkbox") {
		return (
			<BarChart
				data={chartData}
				height={Math.max(200, chartData.length * 40)}
				horizontal
				formatter={(value) => `${value} selections`}
			/>
		);
	}

	if (question.type === "text" || question.type === "textarea") {
		return (
			<div className="space-y-2">
				<p className="text-muted-foreground text-sm">
					{questionAnalytics.totalAnswers} responses
				</p>
				{questionAnalytics.sampleResponses &&
					questionAnalytics.sampleResponses.length > 0 && (
						<div className="space-y-2">
							<p className="font-medium text-muted-foreground text-xs">
								Sample responses:
							</p>
							<ul className="space-y-1">
								{questionAnalytics.sampleResponses.map(
									(response: string, i: number) => (
										<li key={i} className="rounded-md bg-muted/50 p-2 text-sm">
											"{response}"
										</li>
									),
								)}
							</ul>
						</div>
					)}
			</div>
		);
	}

	// Default - bar chart
	return (
		<BarChart
			data={chartData}
			height={200}
			formatter={(value) => `${value} responses`}
		/>
	);
}

// Helper to calculate NPS score
function calculateNPSScore(
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
