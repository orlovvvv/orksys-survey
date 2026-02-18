"use client";

import { Loader2 } from "lucide-react";

import {
	BillingActions,
	PlanCard,
	UsageMeter,
	useSubscription,
} from "@/components/account";

export default function SubscriptionSettingsPage() {
	const { data, isLoading, isPro } = useSubscription();

	// Loading state
	if (isLoading) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<div className="text-center">
					<Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-muted-foreground" />
					<p className="text-muted-foreground text-sm">
						Loading subscription...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h2 className="font-semibold text-lg">Subscription</h2>
				<p className="text-muted-foreground text-sm">
					Manage your subscription and billing
				</p>
			</div>

			{/* Subscription Details Grid */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Plan Card */}
				<PlanCard isPro={isPro} />

				{/* Usage Meter */}
				<UsageMeter
					isPro={isPro}
					surveysUsed={0}
					surveysLimit={3}
					responsesUsed={0}
					responsesLimit={100}
				/>
			</div>

			{/* Billing Actions */}
			<BillingActions isPro={isPro} />

			{/* Additional Info */}
			<div className="rounded-lg border border-dashed p-6">
				<h3 className="font-medium text-sm">Need help?</h3>
				<p className="text-muted-foreground text-sm">
					Contact our support team for help with your subscription or billing
					questions.
				</p>
			</div>
		</div>
	);
}
