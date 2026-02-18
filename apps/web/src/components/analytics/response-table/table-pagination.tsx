import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TablePaginationProps {
	currentPage: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
	onPreviousPage: () => void;
	onNextPage: () => void;
}

export function TablePagination({
	currentPage,
	pageSize,
	totalItems,
	totalPages,
	onPreviousPage,
	onNextPage,
}: TablePaginationProps) {
	const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
	const endItem = Math.min(currentPage * pageSize, totalItems);

	return (
		<div className="mt-4 flex items-center justify-between">
			<p className="text-muted-foreground text-sm">
				{totalItems > 0
					? `Showing ${startItem} to ${endItem} of ${totalItems} responses`
					: "No responses"}
			</p>
			<div className="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={onPreviousPage}
					disabled={currentPage === 1}
				>
					<ChevronLeft className="h-4 w-4" />
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={onNextPage}
					disabled={currentPage >= totalPages}
				>
					Next
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
