"use client";

import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";

export interface Order {
	id: string;
	amount: number;
	currency: string;
	status: "paid" | "pending" | "refunded";
	createdAt: string;
	productBillingType: "one_time" | "recurring";
}

export interface UseOrdersResult {
	orders: Order[];
	isLoading: boolean;
	error: Error | null;
}

// Polar order item type
interface PolarOrderItem {
	id: string;
	amount?: number;
	currency?: string;
	status?: string;
	created_at?: string;
	product_billing_type?: string;
}

/**
 * Fetches the order history for the current user from Polar.
 */
export function useOrders(options?: { limit?: number }): UseOrdersResult {
	const limit = options?.limit ?? 10;

	const query = useQuery({
		queryKey: ["orders", limit],
		queryFn: async () => {
			try {
				const response = await authClient.customer.orders.list({
					query: { page: 1, limit },
				});

				if (!response.data?.items) {
					return [];
				}

				// Transform Polar orders to our Order interface
				return response.data.items.map(
					(order: PolarOrderItem): Order => ({
						id: order.id,
						amount: order.amount ?? 0,
						currency: order.currency ?? "usd",
						status: (order.status as Order["status"]) ?? "pending",
						createdAt: order.created_at ?? new Date().toISOString(),
						productBillingType:
							(order.product_billing_type as Order["productBillingType"]) ??
							"one_time",
					}),
				);
			} catch (_error) {
				// If Polar is not configured, return empty array
				return [];
			}
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	return {
		orders: query.data ?? [],
		isLoading: query.isLoading,
		error: query.error ?? null,
	};
}
