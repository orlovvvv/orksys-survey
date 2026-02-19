"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentOrganization } from "@/hooks/use-current-organization";
import { useSurveysFilters } from "@/hooks/use-surveys-filters";
import { orpc } from "@/utils/orpc";
import {
	type Status,
	SurveysEmpty,
	SurveysHeader,
	SurveysPagination,
	SurveysSelectionBar,
	SurveysStats,
	SurveysTable,
	SurveysTableToolbar,
} from "./components";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 40, 50] as const;
const STORAGE_KEY = "surveys-items-per-page";

function getStoredItemsPerPage(): number {
	if (typeof window === "undefined") return 10;
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (
			stored &&
			ITEMS_PER_PAGE_OPTIONS.includes(
				Number.parseInt(stored, 10) as (typeof ITEMS_PER_PAGE_OPTIONS)[number],
			)
		) {
			return Number.parseInt(stored, 10);
		}
	} catch {
		// Ignore storage errors
	}
	return 10;
}

function SurveysPageContent() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const currentOrg = useCurrentOrganization();
	const storedPerPage = useMemo(() => getStoredItemsPerPage(), []);

	const { filters, setFilters, hasFilters } = useSurveysFilters({
		defaultPerPage: storedPerPage,
	});

	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	// Persist items per page to localStorage
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, String(filters.perPage));
		} catch {
			// Ignore storage errors
		}
	}, [filters.perPage]);

	// Fetch surveys with URL-based filters
	const surveys = useQuery(
		orpc.survey.list.queryOptions({
			input: {
				page: filters.page,
				limit: filters.perPage,
				search: filters.search || undefined,
				status: filters.status,
			},
		}),
	);

	// Fetch total stats (not affected by filters)
	const statsQuery = useQuery(orpc.survey.stats.queryOptions({}));

	// Clear selection when filters change (not on page change)
	// biome-ignore lint/correctness/useExhaustiveDependencies: Intentionally trigger when filters change
	useEffect(() => {
		setSelectedIds(new Set());
	}, [filters.search, filters.status]);

	// Delete mutation
	const deleteMutation = useMutation(
		orpc.survey.delete.mutationOptions({
			onSuccess: () => {
				toast.success("Survey deleted");
				queryClient.invalidateQueries({ queryKey: [["survey"]] });
			},
			onError: (error) => {
				toast.error(error.message || "Failed to delete survey");
			},
		}),
	);

	// Change status mutation
	const changeStatusMutation = useMutation(
		orpc.survey.changeStatus.mutationOptions({
			onSuccess: () => {
				toast.success("Survey status updated");
				queryClient.invalidateQueries({ queryKey: [["survey"]] });
			},
			onError: (error) => {
				toast.error(error.message || "Failed to update status");
			},
		}),
	);

	// Bulk delete mutation
	const bulkDeleteMutation = useMutation(
		orpc.survey.bulkDelete.mutationOptions({
			onSuccess: (data) => {
				toast.success(
					`${data.deletedCount} survey${data.deletedCount !== 1 ? "s" : ""} deleted`,
				);
				setSelectedIds(new Set());
				queryClient.invalidateQueries({ queryKey: [["survey"]] });
			},
			onError: (error) => {
				toast.error(error.message || "Failed to delete surveys");
			},
		}),
	);

	// Bulk change status mutation
	const bulkStatusMutation = useMutation(
		orpc.survey.bulkChangeStatus.mutationOptions({
			onSuccess: (data) => {
				toast.success(
					`${data.updatedCount} survey${data.updatedCount !== 1 ? "s" : ""} updated`,
				);
				setSelectedIds(new Set());
				queryClient.invalidateQueries({ queryKey: [["survey"]] });
			},
			onError: (error) => {
				toast.error(error.message || "Failed to update status");
			},
		}),
	);

	const handleDelete = useCallback(
		(id: string) => {
			if (confirm("Are you sure you want to delete this survey?")) {
				deleteMutation.mutate({ id });
			}
		},
		[deleteMutation],
	);

	const handleStatusChange = useCallback(
		(id: string, status: Status) => {
			changeStatusMutation.mutate({ id, status });
		},
		[changeStatusMutation],
	);

	const handleBulkDelete = useCallback(() => {
		bulkDeleteMutation.mutate({ ids: Array.from(selectedIds) });
	}, [bulkDeleteMutation, selectedIds]);

	const handleBulkStatusChange = useCallback(
		(status: Status) => {
			bulkStatusMutation.mutate({ ids: Array.from(selectedIds), status });
		},
		[bulkStatusMutation, selectedIds],
	);

	const handleCreateClick = useCallback(() => {
		router.push("/surveys/new");
	}, [router]);

	const handlePageChange = useCallback(
		(page: number) => {
			setFilters({ page });
		},
		[setFilters],
	);

	const handleItemsPerPageChange = useCallback(
		(items: number) => {
			setFilters({ perPage: items, page: 1 });
		},
		[setFilters],
	);

	const showEmpty = !surveys.isLoading && surveys.data?.data.length === 0;
	const hasSelection = selectedIds.size > 0;
	const isBulkLoading =
		bulkDeleteMutation.isPending || bulkStatusMutation.isPending;

	return (
		<div className="flex justify-center">
			<div className="w-full max-w-7xl space-y-6 p-4 md:p-6">
				<SurveysHeader
					organizationName={currentOrg?.name}
					surveyCount={statsQuery.data?.total ?? 0}
					canCreate
					onCreateClick={handleCreateClick}
				/>

				<SurveysStats
					stats={
						statsQuery.data ?? {
							total: 0,
							draft: 0,
							published: 0,
							closed: 0,
							archived: 0,
						}
					}
					isLoading={statsQuery.isLoading}
				/>

				<SurveysTableToolbar />

				{showEmpty ? (
					<SurveysEmpty
						organizationName={currentOrg?.name}
						onCreateClick={handleCreateClick}
						hasFilters={hasFilters}
					/>
				) : (
					<SurveysTable
						surveys={surveys.data?.data ?? []}
						isLoading={surveys.isLoading}
						onDelete={handleDelete}
						onStatusChange={handleStatusChange}
						selectedIds={selectedIds}
						onSelectionChange={setSelectedIds}
					/>
				)}

				{surveys.data && surveys.data.pagination.totalPages > 1 && (
					<SurveysPagination
						currentPage={filters.page}
						totalPages={surveys.data.pagination.totalPages}
						onPageChange={handlePageChange}
						totalItems={surveys.data.pagination.total}
						itemsPerPage={filters.perPage}
						onItemsPerPageChange={handleItemsPerPageChange}
						isLoading={surveys.isLoading}
						selectedCount={selectedIds.size}
					/>
				)}
			</div>

			<AnimatePresence>
				{hasSelection && (
					<SurveysSelectionBar
						selectedCount={selectedIds.size}
						onClear={() => setSelectedIds(new Set())}
						onBulkDelete={handleBulkDelete}
						onBulkStatusChange={handleBulkStatusChange}
						isLoading={isBulkLoading}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}

function SurveysPageSkeleton() {
	return (
		<div className="flex justify-center">
			<div className="w-full max-w-7xl space-y-6 p-4 md:p-6">
				<div className="h-8 w-48 animate-pulse rounded bg-muted" />
				<div className="flex gap-3">
					{[1, 2, 3, 4].map((i) => (
						<Skeleton key={i} className="h-10 w-24" />
					))}
				</div>
				<div className="h-10 w-full max-w-md animate-pulse rounded bg-muted" />
				<div className="h-64 w-full animate-pulse rounded bg-muted" />
			</div>
		</div>
	);
}

export default function SurveysPage() {
	return (
		<Suspense fallback={<SurveysPageSkeleton />}>
			<SurveysPageContent />
		</Suspense>
	);
}
