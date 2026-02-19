"use client";

import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const ROWS_PER_PAGE_OPTIONS = [10, 20, 30, 40, 50] as const;

export interface SurveysPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	totalItems: number;
	itemsPerPage: number;
	onItemsPerPageChange?: (items: number) => void;
	isLoading?: boolean;
	selectedCount?: number;
}

export function SurveysPagination({
	currentPage,
	totalPages,
	onPageChange,
	totalItems,
	itemsPerPage,
	onItemsPerPageChange,
	isLoading = false,
	selectedCount = 0,
}: SurveysPaginationProps) {
	if (totalPages <= 1) {
		return null;
	}

	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
				<div className="text-muted-foreground text-sm">
					{isLoading ? (
						<span className="flex items-center gap-2">
							<Loader2 className="h-3.5 w-3.5 animate-spin" />
							Loading...
						</span>
					) : (
						<>
							Showing {startItem} to {endItem} of {totalItems} surveys
						</>
					)}
				</div>
				{selectedCount > 0 && (
					<div className="text-muted-foreground text-sm">
						{selectedCount} of {totalItems} row(s) selected.
					</div>
				)}
			</div>
			<div className="flex items-center gap-4">
				{onItemsPerPageChange && (
					<div className="flex items-center gap-2">
						<span className="text-muted-foreground text-sm">Rows per page</span>
						<Select
							value={`${itemsPerPage}`}
							onValueChange={(value) => {
								if (value) {
									onItemsPerPageChange(Number.parseInt(value, 10));
								}
							}}
							disabled={isLoading}
						>
							<SelectTrigger className="h-8 w-[70px]" size="sm">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{ROWS_PER_PAGE_OPTIONS.map((size) => (
									<SelectItem key={size} value={`${size}`}>
										{size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
				<div className="flex items-center gap-1.5">
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						disabled={currentPage === 1 || isLoading}
						onClick={() => onPageChange(1)}
						aria-label="First page"
					>
						<ChevronsLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						disabled={currentPage === 1 || isLoading}
						onClick={() => onPageChange(currentPage - 1)}
						aria-label="Previous page"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<span className="flex items-center px-3 text-sm tabular-nums">
						Page {currentPage} of {totalPages}
					</span>
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						disabled={currentPage === totalPages || isLoading}
						onClick={() => onPageChange(currentPage + 1)}
						aria-label="Next page"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						disabled={currentPage === totalPages || isLoading}
						onClick={() => onPageChange(totalPages)}
						aria-label="Last page"
					>
						<ChevronsRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
