"use client";

import { format } from "date-fns";
import { ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Order } from "../hooks/use-orders";

export interface InvoiceListProps {
	orders: Order[];
	isLoading?: boolean;
	onOpenPortal?: () => void;
	isPortalLoading?: boolean;
}

function formatCurrency(amount: number, currency: string): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency.toUpperCase(),
		minimumFractionDigits: 2,
	}).format(amount / 100);
}

function StatusBadge({ status }: { status: Order["status"] }) {
	const styles = {
		paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
		pending:
			"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
		refunded:
			"bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
	};

	const labels = {
		paid: "Paid",
		pending: "Pending",
		refunded: "Refunded",
	};

	return (
		<span
			className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium text-xs ${styles[status]}`}
		>
			{labels[status]}
		</span>
	);
}

function TypeBadge({ type }: { type: Order["productBillingType"] }) {
	const styles = {
		recurring:
			"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
		one_time:
			"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
	};

	const labels = {
		recurring: "Recurring",
		one_time: "One-time",
	};

	return (
		<span
			className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium text-xs ${styles[type]}`}
		>
			{labels[type]}
		</span>
	);
}

function InvoiceSkeleton() {
	return (
		<TableRow>
			<TableCell>
				<Skeleton className="h-4 w-20" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-4 w-16" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-5 w-16 rounded-full" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-5 w-16 rounded-full" />
			</TableCell>
		</TableRow>
	);
}

// Static keys for skeleton rows
const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3"] as const;

export function InvoiceList({
	orders,
	isLoading = false,
	onOpenPortal,
	isPortalLoading = false,
}: InvoiceListProps) {
	const hasOrders = orders.length > 0;

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-base">Invoice History</CardTitle>
						<CardDescription>
							View and download your past invoices
						</CardDescription>
					</div>
					{onOpenPortal && (
						<Button
							variant="outline"
							size="sm"
							onClick={onOpenPortal}
							disabled={isPortalLoading}
						>
							<ExternalLink className="mr-2 h-4 w-4" />
							{isPortalLoading ? "Opening..." : "View All Invoices"}
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Type</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{SKELETON_KEYS.map((key) => (
								<InvoiceSkeleton key={key} />
							))}
						</TableBody>
					</Table>
				) : hasOrders ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Type</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders.map((order) => (
								<TableRow key={order.id}>
									<TableCell className="font-medium">
										{format(new Date(order.createdAt), "MMM d, yyyy")}
									</TableCell>
									<TableCell>
										{formatCurrency(order.amount, order.currency)}
									</TableCell>
									<TableCell>
										<StatusBadge status={order.status} />
									</TableCell>
									<TableCell>
										<TypeBadge type={order.productBillingType} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
						<p className="font-medium text-sm">No invoices yet</p>
						<p className="text-muted-foreground text-sm">
							Your invoice history will appear here once you make a purchase.
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
