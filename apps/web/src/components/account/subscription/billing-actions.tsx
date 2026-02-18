"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useCheckout, useCustomerPortal } from "../hooks/use-subscription";

export interface BillingActionsProps {
	isPro: boolean;
}

export function BillingActions({ isPro }: BillingActionsProps) {
	const checkoutMutation = useCheckout();
	const portalMutation = useCustomerPortal();

	const isLoading = checkoutMutation.isPending || portalMutation.isPending;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Billing</CardTitle>
				<CardDescription>
					{isPro
						? "Manage your subscription and payment methods"
						: "Upgrade to unlock more features"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{isPro ? (
					<Button
						variant="outline"
						onClick={() => portalMutation.mutate()}
						disabled={isLoading}
					>
						{isLoading ? "Opening..." : "Manage Subscription"}
					</Button>
				) : (
					<Button
						onClick={() => checkoutMutation.mutate()}
						disabled={isLoading}
					>
						{isLoading ? "Opening..." : "Upgrade to Pro"}
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
