"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

export interface SubscriptionData {
	customer?: {
		id: string;
		email: string;
		created_at: string;
	};
	subscription?: {
		id: string;
		status: string;
		product_id: string;
		price_id: string;
		amount: number;
		currency: string;
		recurring_interval: string;
		current_period_start: string;
		current_period_end: string;
		cancel_at_period_end: boolean;
	};
}

export interface UseSubscriptionResult {
	data: SubscriptionData | null;
	isLoading: boolean;
	error: Error | null;
	isPro: boolean;
}

/**
 * Fetches the subscription state for the current user.
 */
export function useSubscription(): UseSubscriptionResult {
	const query = useQuery({
		queryKey: ["subscription"],
		queryFn: async () => {
			try {
				const response = await authClient.customer.state();
				return (response.data ?? null) as SubscriptionData | null;
			} catch (_error) {
				// If Polar is not configured, return null
				return null;
			}
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	const isPro = !!query.data?.subscription;

	return {
		data: query.data ?? null,
		isLoading: query.isLoading,
		error: query.error ?? null,
		isPro,
	};
}

/**
 * Mutation to open the checkout page for upgrading to Pro.
 */
export function useCheckout() {
	return useMutation({
		mutationFn: async () => {
			await authClient.checkout({ slug: "pro" });
		},
		onError: (error: Error) => {
			toast.error(
				error.message || "Failed to open checkout. Please try again.",
			);
		},
	});
}

/**
 * Mutation to open the Polar customer portal for managing subscriptions.
 */
export function useCustomerPortal() {
	return useMutation({
		mutationFn: async () => {
			await authClient.customer.portal();
		},
		onError: (error: Error) => {
			toast.error(
				error.message || "Failed to open customer portal. Please try again.",
			);
		},
	});
}
