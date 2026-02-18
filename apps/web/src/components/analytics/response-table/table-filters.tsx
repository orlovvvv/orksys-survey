import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface TableFiltersProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	statusFilter: string;
	onStatusFilterChange: (value: string) => void;
}

export function TableFilters({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
}: TableFiltersProps) {
	return (
		<div className="mb-4 flex gap-4">
			<div className="relative flex-1">
				<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Search responses..."
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					className="pl-9"
				/>
			</div>
			<Select
				value={statusFilter}
				onValueChange={(v) => v && onStatusFilterChange(v)}
			>
				<SelectTrigger className="w-[150px]">
					<SelectValue placeholder="Filter by status" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Responses</SelectItem>
					<SelectItem value="complete">Complete</SelectItem>
					<SelectItem value="partial">Partial</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
