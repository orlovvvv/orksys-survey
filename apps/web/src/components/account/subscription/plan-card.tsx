import { CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export interface PlanCardProps {
	isPro: boolean;
}

export function PlanCard({ isPro }: PlanCardProps) {
	const planName = isPro ? "Pro" : "Free";
	const planFeatures = isPro
		? [
				"Unlimited surveys",
				"Unlimited responses",
				"Advanced analytics",
				"Priority support",
				"Custom branding",
			]
		: [
				"Up to 3 surveys",
				"Up to 100 responses/month",
				"Basic analytics",
				"Community support",
			];

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Current Plan</CardTitle>
					<Badge variant={isPro ? "default" : "secondary"}>{planName}</Badge>
				</div>
				<CardDescription>
					{isPro
						? "You have access to all premium features"
						: "Upgrade to unlock more features"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ul className="space-y-2">
					{planFeatures.map((feature) => (
						<li key={feature} className="flex items-center gap-2 text-sm">
							<CheckIcon className="h-4 w-4 text-primary" />
							<span>{feature}</span>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
