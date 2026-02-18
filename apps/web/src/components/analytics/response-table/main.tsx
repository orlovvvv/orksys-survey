"use client";

import type { Question } from "@orksys-survey/db";
import { useQuery } from "@tanstack/react-query";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { orpc } from "@/utils/orpc";

import { createResponseColumns, type ResponseRow } from "./columns";
import { TableFilters } from "./table-filters";
import { TablePagination } from "./table-pagination";

interface ResponseTableProps {
	surveyId: string;
	questions: Question[];
}

export function ResponseTable({ surveyId, questions }: ResponseTableProps) {
	const [page, setPage] = useState(1);
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState("");

	const responses = useQuery(
		orpc.response.list.queryOptions({
			input: {
				surveyId,
				page,
				limit: 20,
				isComplete:
					statusFilter === "all" ? undefined : statusFilter === "complete",
			},
		}),
	);

	const columns = createResponseColumns(questions);

	// Transform data for table
	const tableData: ResponseRow[] =
		responses.data?.data.map((r) => ({
			id: r.id,
			completedAt: r.completedAt?.toISOString() ?? null,
			status: r.isComplete ? "Complete" : "Partial",
			answers: {}, // Would need to fetch answers separately
		})) ?? [];

	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const handleExport = async (format: "csv" | "json") => {
		// For now, just log - would need to implement file download
		console.log("Export", format);
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Responses</CardTitle>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleExport("csv")}
					>
						<Download className="mr-2 h-4 w-4" />
						Export CSV
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<TableFilters
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					statusFilter={statusFilter}
					onStatusFilterChange={setStatusFilter}
				/>

				{/* Table */}
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{responses.isLoading ? (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										<Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
									</TableCell>
								</TableRow>
							) : table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No responses found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				{responses.data?.pagination && (
					<TablePagination
						currentPage={page}
						pageSize={20}
						totalItems={responses.data.pagination.total}
						totalPages={responses.data.pagination.totalPages}
						onPreviousPage={() => setPage((p) => Math.max(1, p - 1))}
						onNextPage={() => setPage((p) => p + 1)}
					/>
				)}
			</CardContent>
		</Card>
	);
}
