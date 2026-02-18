import { Hash, MessageSquare, Smile } from "lucide-react";
import { KeywordList, WordCloud } from "@/components/charts/word-cloud";
import { InsightCard } from "../primitives/insight-card";
import { SentimentBars } from "./sentiment-bars";

interface TextSummaryInsightCardProps {
	isLoading: boolean;
	data?: {
		bullets: string[];
		totalResponses: number;
	};
}

export function TextSummaryInsightCard({
	isLoading,
	data,
}: TextSummaryInsightCardProps) {
	return (
		<InsightCard
			title="Response Summary"
			description="AI-generated summary of key themes from text responses"
			icon={MessageSquare}
			isLoading={isLoading}
		>
			{data ? (
				<div className="space-y-4">
					{data.bullets.map((bullet: string, i: number) => (
						<div key={i} className="flex gap-3">
							<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
								{i + 1}
							</div>
							<p className="text-sm">{bullet}</p>
						</div>
					))}
					{data.totalResponses > 0 && (
						<p className="text-muted-foreground text-xs">
							Based on {data.totalResponses} text responses
						</p>
					)}
				</div>
			) : (
				<p className="text-muted-foreground text-sm">No summary available</p>
			)}
		</InsightCard>
	);
}

interface SentimentData {
	positive: number;
	neutral: number;
	negative: number;
	totalResponses: number;
}

interface SentimentInsightCardProps {
	isLoading: boolean;
	data?: SentimentData;
}

export function SentimentInsightCard({
	isLoading,
	data,
}: SentimentInsightCardProps) {
	return (
		<InsightCard
			title="Sentiment Analysis"
			description="Overall sentiment breakdown of text responses"
			icon={Smile}
			isLoading={isLoading}
		>
			{data ? (
				<SentimentBars sentiment={data} />
			) : (
				<p className="text-muted-foreground text-sm">
					No sentiment data available
				</p>
			)}
		</InsightCard>
	);
}

interface KeywordsInsightCardProps {
	isLoading: boolean;
	data?: {
		keywords: Array<{ word: string; count: number }>;
		totalResponses: number;
	};
}

export function KeywordsInsightCard({
	isLoading,
	data,
}: KeywordsInsightCardProps) {
	return (
		<InsightCard
			title="Keyword Cloud"
			description="Most frequently mentioned keywords and phrases"
			className="lg:col-span-2"
			icon={Hash}
			isLoading={isLoading}
		>
			{data?.keywords.length ? (
				<div className="space-y-6">
					<WordCloud
						keywords={data.keywords.map((k) => ({
							...k,
							weight:
								k.count / Math.max(...data.keywords.map((kw) => kw.count)),
						}))}
						className="min-h-[200px]"
					/>
					<div className="border-t pt-4">
						<h4 className="mb-3 font-medium text-sm">Top Keywords</h4>
						<KeywordList
							keywords={data.keywords.map((k) => ({
								...k,
								weight:
									k.count / Math.max(...data.keywords.map((kw) => kw.count)),
							}))}
							maxItems={10}
						/>
					</div>
					{data.totalResponses > 0 && (
						<p className="text-muted-foreground text-xs">
							Based on {data.totalResponses} text responses
						</p>
					)}
				</div>
			) : (
				<div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
					No keywords found
				</div>
			)}
		</InsightCard>
	);
}
