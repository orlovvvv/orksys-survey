"use client";

import type { Question } from "@orksys-survey/db";
import { useQuery } from "@tanstack/react-query";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	Download,
	Loader2,
	Search,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { orpc } from "@/utils/orpc";

interface ResponseTableProps {
	surveyId: string;
	questions: Question[];
}

interface ResponseRow {
	id: string;
	completedAt: string | null;
	status: string;
	answers: Record<string, unknown>;
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

	const exportMutation = useQuery(
		orpc.analytics.exportResponses.queryOptions({
			input: {
				surveyId,
				format: "json",
				includePartial: statusFilter !== "complete",
			},
			enabled: false, // Don't fetch automatically
		}),
	);

	// Define columns
	const columns: ColumnDef<ResponseRow>[] = [
		{
			accessorKey: "id",
			header: "Response ID",
			cell: ({ row }) => (
				<span className="font-mono text-xs">{row.getValue("id")}</span>
			),
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const status = row.getValue("status") as string;
				return (
					<span
						className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium text-xs ${
							status === "Complete"
								? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
								: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
						}`}
					>
						{status}
					</span>
				);
			},
		},
		{
			accessorKey: "completedAt",
			header: "Date",
			cell: ({ row }) => {
				const date = row.getValue("completedAt") as string | null;
				if (!date) return <span className="text-muted-foreground">—</span>;
				return new Date(date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					hour: "2-digit",
					minute: "2-digit",
				});
			},
		},
		// Add columns for first 3 questions
		...questions.slice(0, 3).map((q) => ({
			id: `answer-${q.id}`,
			accessorFn: (row: ResponseRow) => row.answers?.[q.id],
			header: q.title.length > 20 ? `${q.title.slice(0, 20)}...` : q.title,
			cell: ({ getValue }: { getValue: () => unknown }) => {
				const value = getValue();
				if (value === null || value === undefined) {
					return <span className="text-muted-foreground">—</span>;
				}
				const strValue =
					typeof value === "string" ? value : JSON.stringify(value);
				return (
					<span className="max-w-[150px] truncate text-sm">
						{strValue.length > 30 ? `${strValue.slice(0, 30)}...` : strValue}
					</span>
				);
			},
		})),
	];

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
				{/* Filters */}
				<div className="mb-4 flex gap-4">
					<div className="relative flex-1">
						<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search responses..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
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

				{/* Pagination */}
				{responses.data?.pagination && (
					<div className="mt-4 flex items-center justify-between">
						<p className="text-muted-foreground text-sm">
							Showing {(page - 1) * 20 + 1} to{" "}
							{Math.min(page * 20, responses.data.pagination.total)} of{" "}
							{responses.data.pagination.total} responses
						</p>
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1}
							>
								<ChevronLeft className="h-4 w-4" />
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage((p) => p + 1)}
								disabled={page >= (responses.data?.pagination.totalPages ?? 1)}
							>
								Next
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
