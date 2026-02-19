"use client";

import { Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	type SurveyStatus,
	useSurveysFilters,
} from "@/hooks/use-surveys-filters";

const DEBOUNCE_MS = 300;

const statusOptions: Array<{ value: SurveyStatus; label: string }> = [
	{ value: "draft", label: "Draft" },
	{ value: "published", label: "Published" },
	{ value: "closed", label: "Closed" },
	{ value: "archived", label: "Archived" },
];

export function SurveysTableToolbar() {
	const { filters, setFilters, resetFilters, hasFilters } = useSurveysFilters();
	const [searchInput, setSearchInput] = useState(filters.search);

	// Sync local state when URL changes (browser back/forward)
	useEffect(() => {
		setSearchInput(filters.search);
	}, [filters.search]);

	// Debounced search update
	useEffect(() => {
		const timer = setTimeout(() => {
			if (searchInput !== filters.search) {
				setFilters({ search: searchInput || undefined });
			}
		}, DEBOUNCE_MS);
		return () => clearTimeout(timer);
	}, [searchInput, filters.search, setFilters]);

	const handleStatusChange = useCallback(
		(value: string | null) => {
			setFilters({ status: (value as SurveyStatus) || undefined });
		},
		[setFilters],
	);

	const handleToggleChange = useCallback(
		(values: readonly string[]) => {
			setFilters({ status: (values[0] as SurveyStatus) || undefined });
		},
		[setFilters],
	);

	return (
		<div className="@container/filters flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			{/* Search input */}
			<div className="relative min-w-[200px] max-w-md flex-1">
				<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Search surveys..."
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					className="pl-10"
				/>
			</div>

			<div className="flex items-center gap-2">
				{/* Status toggle group (desktop) */}
				<ToggleGroup
					value={filters.status ? [filters.status] : []}
					onValueChange={handleToggleChange}
					variant="outline"
					className="@[767px]/filters:flex hidden flex-wrap"
				>
					{statusOptions.map((opt) => (
						<ToggleGroupItem key={opt.value} value={opt.value}>
							{opt.label}
						</ToggleGroupItem>
					))}
				</ToggleGroup>

				{/* Status select (mobile) */}
				<Select value={filters.status ?? ""} onValueChange={handleStatusChange}>
					<SelectTrigger
						className="@[767px]/filters:hidden w-[140px]"
						size="sm"
					>
						<SelectValue placeholder="All statuses" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">All statuses</SelectItem>
						{statusOptions.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Reset button */}
				{hasFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={resetFilters}
						className="@[767px]/filters:inline-flex hidden"
					>
						Reset
						<X className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>
		</div>
	);
}
