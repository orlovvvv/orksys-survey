import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Progress,
	ProgressLabel,
	ProgressTrack,
} from "@/components/ui/progress";

export interface UsageMeterProps {
	surveysUsed?: number;
	surveysLimit?: number;
	responsesUsed?: number;
	responsesLimit?: number;
	isPro?: boolean;
}

export function UsageMeter({
	surveysUsed = 0,
	surveysLimit = 3,
	responsesUsed = 0,
	responsesLimit = 100,
	isPro = false,
}: UsageMeterProps) {
	// Calculate percentages
	const surveysPercent = isPro
		? 0
		: Math.min((surveysUsed / surveysLimit) * 100, 100);
	const responsesPercent = isPro
		? 0
		: Math.min((responsesUsed / responsesLimit) * 100, 100);

	// For Pro users, show unlimited
	const surveysDisplay = isPro
		? "Unlimited"
		: `${surveysUsed} of ${surveysLimit}`;
	const responsesDisplay = isPro
		? "Unlimited"
		: `${responsesUsed} of ${responsesLimit}`;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Usage</CardTitle>
				<CardDescription>
					{isPro
						? "You have unlimited access to all features"
						: "Track your usage against plan limits"}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Surveys Meter */}
				{!isPro && (
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<ProgressLabel>Surveys</ProgressLabel>
							<span className="text-muted-foreground tabular-nums">
								{surveysDisplay}
							</span>
						</div>
						<Progress value={surveysPercent}>
							<ProgressTrack>
								<div
									className="h-full bg-primary transition-all"
									style={{ width: `${surveysPercent}%` }}
								/>
							</ProgressTrack>
						</Progress>
					</div>
				)}

				{/* Responses Meter */}
				{!isPro && (
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<ProgressLabel>Responses (this month)</ProgressLabel>
							<span className="text-muted-foreground tabular-nums">
								{responsesDisplay}
							</span>
						</div>
						<Progress value={responsesPercent}>
							<ProgressTrack>
								<div
									className="h-full bg-primary transition-all"
									style={{ width: `${responsesPercent}%` }}
								/>
							</ProgressTrack>
						</Progress>
					</div>
				)}

				{isPro && (
					<div className="space-y-4 rounded-lg border border-dashed p-6 text-center">
						<p className="font-medium text-sm">Unlimited Access</p>
						<p className="text-muted-foreground text-sm">
							As a Pro subscriber, you have unlimited surveys and responses.
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
