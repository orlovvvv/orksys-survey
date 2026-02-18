"use client";

import type { Question } from "@orksys-survey/db";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Brain } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { orpc } from "@/utils/orpc";
import {
	KeywordsInsightCard,
	SentimentInsightCard,
	TextSummaryInsightCard,
} from "./insight-card";

interface AIInsightsProps {
	surveyId: string;
	questions: Question[];
}

export function AIInsights({ surveyId }: AIInsightsProps) {
	const status = useQuery(
		orpc.insights.getStatus.queryOptions({ input: { surveyId } }),
	);

	const textSummary = useQuery(
		orpc.insights.getTextSummary.queryOptions({ input: { surveyId } }),
	);

	const sentiment = useQuery(
		orpc.insights.getSentimentAnalysis.queryOptions({ input: { surveyId } }),
	);

	const keywords = useQuery(
		orpc.insights.getKeywords.queryOptions({ input: { surveyId } }),
	);

	// Check if Groq is configured
	if (!status.data?.available) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Brain className="h-5 w-5" />
						AI Insights
					</CardTitle>
					<CardDescription>
						AI-powered analysis of your survey responses
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center gap-4 py-8 text-center">
						<AlertCircle className="h-12 w-12 text-muted-foreground" />
						<div>
							<h3 className="font-semibold">AI Insights Not Available</h3>
							<p className="mt-1 text-muted-foreground text-sm">
								{status.data?.message ||
									"Add GROQ_API_KEY to your environment to enable AI insights"}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			{/* Text Summary */}
			<TextSummaryInsightCard
				isLoading={textSummary.isLoading}
				data={textSummary.data}
			/>

			{/* Sentiment Analysis */}
			<SentimentInsightCard
				isLoading={sentiment.isLoading}
				data={sentiment.data}
			/>

			{/* Keywords - Full width */}
			<KeywordsInsightCard
				isLoading={keywords.isLoading}
				data={keywords.data}
			/>
		</div>
	);
}
