"use client";

import { BarChart3 } from "lucide-react";
import { ChartRenderer } from "@/components/analytics/question-charts/chart-renderer";
import { questionTypeLabels } from "@/components/analytics/question-charts/utils";

import { useSurveyAnalytics } from "../providers";
import { useSurveyQuestionQuery } from "../queries";
import { formatNumber, formatPercentage } from "../utils/formatters";
import {
	WidgetCard,
	WidgetEmpty,
	WidgetError,
	WidgetLoading,
	WidgetRefreshButton,
} from "../widget-parts";

interface QuestionMetricsWidgetProps {
	questionId: string;
}

export function QuestionMetricsWidget({
	questionId,
}: QuestionMetricsWidgetProps) {
	const { questions } = useSurveyAnalytics();
	const analytics = useSurveyQuestionQuery(questionId);

	const question = questions.find((q) => q.id === questionId);

	const handleRefresh = () => {
		analytics.refetch();
	};

	if (!question) {
		return (
			<WidgetCard title="Question Not Found">
				<WidgetEmpty
					title="Question not found"
					description="This question may have been deleted"
				/>
			</WidgetCard>
		);
	}

	if (analytics.isLoading) {
		return (
			<WidgetCard
				title={question.title}
				tooltip={{
					title: questionTypeLabels[question.type] || question.type,
					description: "Analytics for this specific question",
				}}
			>
				<WidgetLoading type="chart" height={200} />
			</WidgetCard>
		);
	}

	if (analytics.error) {
		return (
			<WidgetCard title={question.title}>
				<WidgetError
					title="Unable to load question analytics"
					onRetry={handleRefresh}
					isRetrying={analytics.isFetching}
				/>
			</WidgetCard>
		);
	}

	const questionAnalytics = analytics.data?.[0];

	if (!questionAnalytics || questionAnalytics.totalAnswers === 0) {
		return (
			<WidgetCard
				title={question.title}
				tooltip={{
					title:
						questionTypeLabels[
							questionAnalytics?.questionType || question.type
						] || question.type,
					description: "Analytics for this specific question",
				}}
			>
				<WidgetEmpty
					title="No responses yet"
					description="Analytics will appear once respondents answer this question"
				/>
			</WidgetCard>
		);
	}

	return (
		<WidgetCard
			title={questionAnalytics.questionTitle}
			tooltip={{
				title:
					questionTypeLabels[questionAnalytics.questionType] ||
					questionAnalytics.questionType,
				description: `${formatNumber(questionAnalytics.totalAnswers)} answers`,
			}}
			action={
				<WidgetRefreshButton
					onRefresh={handleRefresh}
					isRefreshing={analytics.isFetching}
				/>
			}
		>
			{/* Use existing ChartRenderer for consistent chart rendering */}
			<div className="min-h-[200px]">
				<ChartRenderer
					questionAnalytics={questionAnalytics}
					question={question}
				/>
			</div>

			{/* Additional metrics footer */}
			{questionAnalytics.average !== undefined && (
				<div className="mt-4 border-t pt-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<BarChart3 className="h-4 w-4 text-muted-foreground" />
							<span className="text-muted-foreground text-xs">Average:</span>
							<span className="font-semibold text-sm">
								{questionAnalytics.average.toFixed(1)}
							</span>
						</div>
						{questionAnalytics.min !== undefined &&
							questionAnalytics.max !== undefined && (
								<div className="text-muted-foreground text-xs">
									Range: {questionAnalytics.min} - {questionAnalytics.max}
								</div>
							)}
					</div>
				</div>
			)}

			{/* Distribution stats */}
			{questionAnalytics.distribution.length > 0 && (
				<div className="mt-4 border-t pt-4">
					<p className="mb-2 font-medium text-muted-foreground text-xs">
						Top Responses
					</p>
					<div className="space-y-1">
						{questionAnalytics.distribution
							.slice(0, 3)
							.map(
								(item: {
									value: string;
									count: number;
									percentage: number;
								}) => (
									<div
										key={item.value}
										className="flex items-center justify-between text-xs"
									>
										<span
											className="truncate text-muted-foreground"
											title={item.value}
										>
											{item.value.length > 30
												? `${item.value.slice(0, 30)}...`
												: item.value}
										</span>
										<span className="font-medium">
											{formatNumber(item.count)} (
											{formatPercentage(item.percentage)})
										</span>
									</div>
								),
							)}
					</div>
				</div>
			)}
		</WidgetCard>
	);
}
