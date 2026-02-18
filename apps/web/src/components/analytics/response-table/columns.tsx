import type { Question } from "@orksys-survey/db";
import type { ColumnDef } from "@tanstack/react-table";

interface ResponseRow {
	id: string;
	completedAt: string | null;
	status: string;
	answers: Record<string, unknown>;
}

export function createResponseColumns(
	questions: Question[],
): ColumnDef<ResponseRow>[] {
	return [
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
								? "bg-success/10 text-success"
								: "bg-warning/10 text-warning"
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
}

export type { ResponseRow };
