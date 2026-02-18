"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";

import { AnalyticsOverview } from "@/components/analytics/analytics-overview";
import { AnalyticsTabs } from "@/components/analytics/analytics-tabs";
import { Button } from "@/components/ui/button";
import { orpc } from "@/utils/orpc";

export default function AnalyticsPage({
	params,
}: {
	params: Promise<{ surveyId: string }>;
}) {
	const { surveyId } = use(params);

	const survey = useQuery(
		orpc.survey.getById.queryOptions({ input: { id: surveyId } }),
	);

	const questions = useQuery(
		orpc.question.list.queryOptions({ input: { surveyId } }),
	);

	const summary = useQuery(
		orpc.analytics.getSummary.queryOptions({ input: { surveyId } }),
	);

	if (survey.isLoading || questions.isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (survey.isError || !survey.data) {
		notFound();
	}

	return (
		<div className="flex h-full flex-col overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between border-b px-6 py-4">
				<div className="flex items-center gap-4">
					<Link href={`/surveys/${surveyId}`}>
						<Button variant="ghost" size="icon">
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<div>
						<h1 className="font-semibold text-lg">{survey.data.title}</h1>
						<p className="text-muted-foreground text-sm">
							Analytics & Insights
						</p>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-auto">
				<div className="mx-auto max-w-6xl p-6">
					{/* Summary Cards */}
					<AnalyticsOverview
						summary={summary.data}
						isLoading={summary.isLoading}
					/>

					{/* Tabs for detailed analytics */}
					<AnalyticsTabs surveyId={surveyId} questions={questions.data || []} />
				</div>
			</div>
		</div>
	);
}
