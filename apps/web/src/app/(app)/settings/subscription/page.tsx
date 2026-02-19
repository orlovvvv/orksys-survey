"use client";

import { CreditCard, Loader2 } from "lucide-react";

import {
	BillingActions,
	InvoiceList,
	PlanCard,
	UsageMeter,
	useCustomerPortal,
	useOrders,
	useSubscription,
	useUsageStats,
} from "@/components/account";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function SubscriptionSettingsPage() {
	const { isLoading, isPro } = useSubscription();
	const { data: usageStats } = useUsageStats(isPro);
	const { orders, isLoading: isOrdersLoading } = useOrders({ limit: 5 });
	const portalMutation = useCustomerPortal();

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
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
						<CreditCard className="h-5 w-5 text-primary" />
					</div>
					<div>
						<h1 className="font-bold text-2xl text-foreground">
							Billing & Subscription
						</h1>
						<p className="text-muted-foreground text-sm">
							Manage your subscription and billing
						</p>
					</div>
				</div>
			</div>

			{/* Subscription Details Grid */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Plan Card */}
				<PlanCard isPro={isPro} />

				{/* Usage Meter */}
				<UsageMeter
					isPro={isPro}
					surveysUsed={usageStats?.surveysCount ?? 0}
					surveysLimit={usageStats?.surveysLimit ?? 3}
					responsesUsed={usageStats?.responsesThisMonth ?? 0}
					responsesLimit={usageStats?.responsesLimit ?? 100}
				/>
			</div>

			{/* Billing Actions */}
			<BillingActions isPro={isPro} />

			{/* Invoice History */}
			<InvoiceList
				orders={orders}
				isLoading={isOrdersLoading}
				onOpenPortal={() => portalMutation.mutate()}
				isPortalLoading={portalMutation.isPending}
			/>

			{/* Help Card */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Need help?</CardTitle>
					<CardDescription>
						Contact our support team for help with your subscription or billing
						questions.
					</CardDescription>
				</CardHeader>
			</Card>
		</div>
	);
}
