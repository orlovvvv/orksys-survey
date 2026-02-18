import { Frown, Meh, Smile } from "lucide-react";

import { Progress } from "@/components/ui/progress";

interface SentimentData {
	positive: number;
	neutral: number;
	negative: number;
	totalResponses: number;
}

interface SentimentBarsProps {
	sentiment: SentimentData;
}

export function SentimentBars({ sentiment }: SentimentBarsProps) {
	return (
		<div className="space-y-6">
			{/* Visual sentiment bars */}
			<div className="space-y-4">
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="flex items-center gap-2 text-sm">
							<Smile className="h-4 w-4 text-success" />
							Positive
						</span>
						<span className="font-medium text-sm">{sentiment.positive}%</span>
					</div>
					<Progress value={sentiment.positive} className="h-2" />
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="flex items-center gap-2 text-sm">
							<Meh className="h-4 w-4 text-warning" />
							Neutral
						</span>
						<span className="font-medium text-sm">{sentiment.neutral}%</span>
					</div>
					<Progress value={sentiment.neutral} className="h-2" />
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="flex items-center gap-2 text-sm">
							<Frown className="h-4 w-4 text-destructive" />
							Negative
						</span>
						<span className="font-medium text-sm">{sentiment.negative}%</span>
					</div>
					<Progress value={sentiment.negative} className="h-2" />
				</div>
			</div>

			{sentiment.totalResponses > 0 && (
				<p className="text-muted-foreground text-xs">
					Based on {sentiment.totalResponses} text responses
				</p>
			)}
		</div>
	);
}
