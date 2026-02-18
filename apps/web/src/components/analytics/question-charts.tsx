"use client";

import type { Question } from "@orksys-survey/db";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { NpsGauge, RatingDisplay } from "@/components/charts/nps-gauge";
import { PieChart, PieChartLegend } from "@/components/charts/pie-chart";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { orpc } from "@/utils/orpc";

interface QuestionChartsProps {
	surveyId: string;
	questions: Question[];
}

interface DistributionItem {
	value: string;
	count: number;
	percentage: number;
}

interface QuestionAnalytics {
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

const questionTypeLabels: Record<string, string> = {
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

export function QuestionCharts({ surveyId, questions }: QuestionChartsProps) {
	const analytics = useQuery(
		orpc.analytics.getQuestionAnalytics.queryOptions({
			input: { surveyId },
		}),
	);

	const trends = useQuery(
		orpc.analytics.getTrends.queryOptions({
			input: { surveyId, days: 30 },
		}),
	);

	if (analytics.isLoading) {
		return (
			<div className="flex h-[400px] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	const questionAnalytics: QuestionAnalytics[] = analytics.data || [];

	// Render chart based on question type
	const renderChart = (qa: QuestionAnalytics) => {
		const question = questions.find((q) => q.id === qa.questionId);
		if (!question) return null;

		const chartData = qa.distribution.map((d: DistributionItem) => ({
			name: d.value,
			value: d.count,
		}));

		// Chart choice based on question type
		if (question.type === "nps") {
			// NPS - calculate score and show gauge
			const npsScore = calculateNPSScore(qa.distribution);
			return (
				<div className="flex flex-col items-center gap-4">
					<NpsGauge score={npsScore} size="lg" />
					<div className="text-center">
						<p className="font-medium text-muted-foreground text-sm">
							Net Promoter Score
						</p>
						<p className="text-muted-foreground text-xs">
							Based on {qa.totalAnswers} responses
						</p>
					</div>
				</div>
			);
		}

		if (question.type === "rating" || question.type === "linear_scale") {
			// Rating - show bar chart with average
			return (
				<div className="space-y-4">
					{qa.average !== undefined && (
						<RatingDisplay value={qa.average} max={question.config?.max || 5} />
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
			// Single choice - pie chart
			return (
				<div className="flex flex-col items-center gap-4">
					<PieChart data={chartData} height={250} outerRadius={90} />
					<PieChartLegend data={chartData} />
				</div>
			);
		}

		if (question.type === "checkbox") {
			// Multiple selections - horizontal bar chart
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
			// Text - show sample responses
			return (
				<div className="space-y-2">
					<p className="text-muted-foreground text-sm">
						{qa.totalAnswers} responses
					</p>
					{qa.sampleResponses && qa.sampleResponses.length > 0 && (
						<div className="space-y-2">
							<p className="font-medium text-muted-foreground text-xs">
								Sample responses:
							</p>
							<ul className="space-y-1">
								{qa.sampleResponses.map((response: string, i: number) => (
									<li key={i} className="rounded-md bg-muted/50 p-2 text-sm">
										"{response}"
									</li>
								))}
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
	};

	return (
		<div className="space-y-8">
			{/* Response Trends */}
			<Card>
				<CardHeader>
					<CardTitle>Response Trends</CardTitle>
					<CardDescription>
						Daily responses over the last 30 days
					</CardDescription>
				</CardHeader>
				<CardContent>
					{trends.isLoading ? (
						<div className="flex h-[200px] items-center justify-center">
							<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
						</div>
					) : (
						<LineChart
							data={(trends.data || []) as unknown as Record<string, unknown>[]}
							xKey="date"
							series={[
								{ key: "responses", name: "All Responses" },
								{ key: "completions", name: "Completions" },
							]}
							height={250}
							formatter={(value) => `${value} responses`}
						/>
					)}
				</CardContent>
			</Card>

			{/* Per-Question Analytics */}
			<div className="grid gap-6 md:grid-cols-2">
				{questionAnalytics.map((qa) => {
					const question = questions.find((q) => q.id === qa.questionId);
					if (!question) return null;

					return (
						<Card key={qa.questionId}>
							<CardHeader>
								<CardTitle className="text-base">{qa.questionTitle}</CardTitle>
								<CardDescription>
									{questionTypeLabels[qa.questionType] || qa.questionType} •{" "}
									{qa.totalAnswers} answers
								</CardDescription>
							</CardHeader>
							<CardContent>{renderChart(qa)}</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}

// Helper to calculate NPS score
function calculateNPSScore(
	distribution: Array<{ value: string; count: number }>,
): number {
	let promoters = 0;
	let passives = 0;
	let detractors = 0;
	let total = 0;

	for (const item of distribution) {
		const score = Number.parseInt(item.value, 10);
		if (Number.isNaN(score)) continue;

		total += item.count;
		if (score >= 9) promoters += item.count;
		else if (score >= 7) passives += item.count;
		else detractors += item.count;
	}

	if (total === 0) return 0;

	const promoterPercent = (promoters / total) * 100;
	const detractorPercent = (detractors / total) * 100;

	return Math.round(promoterPercent - detractorPercent);
}
