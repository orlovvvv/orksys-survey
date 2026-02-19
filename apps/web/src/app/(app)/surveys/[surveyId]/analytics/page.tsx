"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useEffect } from "react";
import {
	SurveyAnalyticsProvider,
	SurveyAnalyticsTabs,
	useSurveyAnalytics,
} from "@/components/survey-analytics";
import { Button } from "@/components/ui/button";
import { orpc } from "@/utils/orpc";

function AnalyticsContent({ surveyId }: { surveyId: string }) {
	const { setSurvey, setQuestions } = useSurveyAnalytics();

	const survey = useQuery(
		orpc.survey.getById.queryOptions({ input: { id: surveyId } }),
	);

	const questions = useQuery(
		orpc.question.list.queryOptions({ input: { surveyId } }),
	);

	// Update provider context when data loads
	useEffect(() => {
		if (survey.data) {
			setSurvey(survey.data);
		}
	}, [survey.data, setSurvey]);

	useEffect(() => {
		if (questions.data) {
			setQuestions(questions.data);
		}
	}, [questions.data, setQuestions]);

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
				<div className="mx-auto w-full max-w-7xl p-4 md:p-6">
					{/* Tabs for detailed analytics */}
					<SurveyAnalyticsTabs />
				</div>
			</div>
		</div>
	);
}

export default function AnalyticsPage({
	params,
}: {
	params: Promise<{ surveyId: string }>;
}) {
	const { surveyId } = use(params);

	return (
		<SurveyAnalyticsProvider surveyId={surveyId}>
			<AnalyticsContent surveyId={surveyId} />
		</SurveyAnalyticsProvider>
	);
}
