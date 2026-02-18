"use client";

import type { Question } from "@orksys-survey/db";
import { useQuery } from "@tanstack/react-query";
import {
	AlertCircle,
	Brain,
	Frown,
	Hash,
	Loader2,
	Meh,
	MessageSquare,
	RefreshCw,
	Smile,
} from "lucide-react";

import { KeywordList, WordCloud } from "@/components/charts/word-cloud";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { orpc } from "@/utils/orpc";

interface AIInsightsProps {
	surveyId: string;
	questions: Question[];
}

export function AIInsights({ surveyId, questions }: AIInsightsProps) {
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
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<MessageSquare className="h-5 w-5" />
						Response Summary
					</CardTitle>
					<CardDescription>
						AI-generated summary of key themes from text responses
					</CardDescription>
				</CardHeader>
				<CardContent>
					{textSummary.isLoading ? (
						<div className="flex h-[200px] items-center justify-center">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					) : textSummary.data ? (
						<div className="space-y-4">
							{textSummary.data.bullets.map((bullet: string, i: number) => (
								<div key={i} className="flex gap-3">
									<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
										{i + 1}
									</div>
									<p className="text-sm">{bullet}</p>
								</div>
							))}
							{textSummary.data.totalResponses > 0 && (
								<p className="text-muted-foreground text-xs">
									Based on {textSummary.data.totalResponses} text responses
								</p>
							)}
						</div>
					) : (
						<p className="text-muted-foreground text-sm">
							No summary available
						</p>
					)}
				</CardContent>
			</Card>

			{/* Sentiment Analysis */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Smile className="h-5 w-5" />
						Sentiment Analysis
					</CardTitle>
					<CardDescription>
						Overall sentiment breakdown of text responses
					</CardDescription>
				</CardHeader>
				<CardContent>
					{sentiment.isLoading ? (
						<div className="flex h-[200px] items-center justify-center">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					) : sentiment.data ? (
						<div className="space-y-6">
							{/* Visual sentiment bars */}
							<div className="space-y-4">
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="flex items-center gap-2 text-sm">
											<Smile className="h-4 w-4 text-green-500" />
											Positive
										</span>
										<span className="font-medium text-sm">
											{sentiment.data.positive}%
										</span>
									</div>
									<Progress value={sentiment.data.positive} className="h-2" />
								</div>

								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="flex items-center gap-2 text-sm">
											<Meh className="h-4 w-4 text-yellow-500" />
											Neutral
										</span>
										<span className="font-medium text-sm">
											{sentiment.data.neutral}%
										</span>
									</div>
									<Progress value={sentiment.data.neutral} className="h-2" />
								</div>

								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="flex items-center gap-2 text-sm">
											<Frown className="h-4 w-4 text-red-500" />
											Negative
										</span>
										<span className="font-medium text-sm">
											{sentiment.data.negative}%
										</span>
									</div>
									<Progress value={sentiment.data.negative} className="h-2" />
								</div>
							</div>

							{sentiment.data.totalResponses > 0 && (
								<p className="text-muted-foreground text-xs">
									Based on {sentiment.data.totalResponses} text responses
								</p>
							)}
						</div>
					) : (
						<p className="text-muted-foreground text-sm">
							No sentiment data available
						</p>
					)}
				</CardContent>
			</Card>

			{/* Keywords - Full width */}
			<Card className="lg:col-span-2">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Hash className="h-5 w-5" />
						Keyword Cloud
					</CardTitle>
					<CardDescription>
						Most frequently mentioned keywords and phrases
					</CardDescription>
				</CardHeader>
				<CardContent>
					{keywords.isLoading ? (
						<div className="flex h-[200px] items-center justify-center">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					) : keywords.data?.keywords.length ? (
						<div className="space-y-6">
							<WordCloud
								keywords={keywords.data.keywords}
								className="min-h-[200px]"
							/>
							<div className="border-t pt-4">
								<h4 className="mb-3 font-medium text-sm">Top Keywords</h4>
								<KeywordList keywords={keywords.data.keywords} maxItems={10} />
							</div>
							{keywords.data.totalResponses > 0 && (
								<p className="text-muted-foreground text-xs">
									Based on {keywords.data.totalResponses} text responses
								</p>
							)}
						</div>
					) : (
						<div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
							No keywords found
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
