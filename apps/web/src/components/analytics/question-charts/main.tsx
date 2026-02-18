"use client";

import type { Question } from "@orksys-survey/db";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { LineChart } from "@/components/charts/line-chart";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { orpc } from "@/utils/orpc";

import { ChartRenderer } from "./chart-renderer";
import { type QuestionAnalytics, questionTypeLabels } from "./utils";

interface QuestionChartsProps {
	surveyId: string;
	questions: Question[];
}

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
							<CardContent>
								<ChartRenderer questionAnalytics={qa} question={question} />
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
