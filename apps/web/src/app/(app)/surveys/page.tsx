"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Archive,
	BarChart3,
	Calendar,
	ClipboardList,
	Edit,
	Loader2,
	MoreHorizontal,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { orpc } from "@/utils/orpc";

const statusColors = {
	draft: "bg-muted text-muted-foreground",
	published:
		"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
	closed:
		"bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
	archived: "bg-muted text-muted-foreground",
};

export default function SurveysPage() {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"draft" | "published" | "closed" | "archived" | undefined
	>(undefined);
	const [page, setPage] = useState(1);

	const queryClient = useQueryClient();

	const surveys = useQuery(
		orpc.survey.list.queryOptions({
			input: {
				page,
				limit: 10,
				search: search || undefined,
				status: statusFilter,
			},
		}),
	);

	const deleteMutation = useMutation(
		orpc.survey.delete.mutationOptions({
			onSuccess: () => {
				toast.success("Survey deleted");
				queryClient.invalidateQueries({ queryKey: ["survey", "list"] });
			},
			onError: (error) => {
				toast.error(error.message || "Failed to delete survey");
			},
		}),
	);

	const changeStatusMutation = useMutation(
		orpc.survey.changeStatus.mutationOptions({
			onSuccess: () => {
				toast.success("Survey status updated");
				queryClient.invalidateQueries({ queryKey: ["survey", "list"] });
			},
			onError: (error) => {
				toast.error(error.message || "Failed to update status");
			},
		}),
	);

	const handleDelete = (id: string) => {
		if (confirm("Are you sure you want to delete this survey?")) {
			deleteMutation.mutate({ id });
		}
	};

	const handleStatusChange = (
		id: string,
		status: "draft" | "published" | "closed" | "archived",
	) => {
		changeStatusMutation.mutate({ id, status });
	};

	return (
		<div className="mx-auto w-full max-w-6xl p-6">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl text-foreground">Surveys</h1>
					<p className="text-muted-foreground">
						Create and manage your surveys
					</p>
				</div>
				<Button nativeButton={false} render={<Link href="/surveys/new" />}>
					<Plus className="mr-2 h-4 w-4" />
					Create Survey
				</Button>
			</div>

			{/* Filters */}
			<div className="mb-6 flex flex-wrap items-center gap-4">
				<div className="relative min-w-[200px] flex-1">
					<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search surveys..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
						className="pl-10"
					/>
				</div>
				<div className="flex gap-2">
					{(["draft", "published", "closed", "archived"] as const).map(
						(status) => (
							<Button
								key={status}
								variant={statusFilter === status ? "default" : "outline"}
								size="sm"
								onClick={() => {
									setStatusFilter(statusFilter === status ? undefined : status);
									setPage(1);
								}}
							>
								{status.charAt(0).toUpperCase() + status.slice(1)}
							</Button>
						),
					)}
				</div>
			</div>

			{/* Survey List */}
			{surveys.isLoading ? (
				<div className="flex justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			) : surveys.data?.data.length === 0 ? (
				<Card className="border-dashed">
					<CardContent className="flex flex-col items-center justify-center py-16">
						<ClipboardList className="mb-4 h-12 w-12 text-muted-foreground/50" />
						<CardTitle className="mb-2">No surveys yet</CardTitle>
						<CardDescription className="mb-4 text-center">
							Create your first survey to start collecting responses
						</CardDescription>
						<Button nativeButton={false} render={<Link href="/surveys/new" />}>
							<Plus className="mr-2 h-4 w-4" />
							Create Survey
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{surveys.data?.data.map((survey) => (
						<Card
							key={survey.id}
							className="transition-colors hover:border-border/80"
						>
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex flex-wrap items-center gap-2">
											<Link
												href={`/surveys/${survey.id}`}
												className="font-semibold text-lg hover:text-primary"
											>
												{survey.title}
											</Link>
											<Badge
												variant="secondary"
												className={statusColors[survey.status]}
											>
												{survey.status}
											</Badge>
											{survey.organization && (
												<Badge variant="outline" className="gap-1">
													{survey.organization.name}
												</Badge>
											)}
										</div>
										{survey.description && (
											<CardDescription className="mt-1">
												{survey.description}
											</CardDescription>
										)}
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger
											render={<Button variant="ghost" size="icon" />}
										>
											<MoreHorizontal className="h-4 w-4" />
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>
												<Link
													href={`/surveys/${survey.id}`}
													className="flex items-center"
												>
													<Edit className="mr-2 h-4 w-4" />
													Edit
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Link
													href={{
														pathname: `/surveys/${survey.id}/analytics`,
													}}
													className="flex items-center"
												>
													<BarChart3 className="mr-2 h-4 w-4" />
													Analytics
												</Link>
											</DropdownMenuItem>
											{survey.status === "draft" && (
												<DropdownMenuItem
													onClick={() =>
														handleStatusChange(survey.id, "published")
													}
												>
													<ClipboardList className="mr-2 h-4 w-4" />
													Publish
												</DropdownMenuItem>
											)}
											{survey.status === "published" && (
												<DropdownMenuItem
													onClick={() =>
														handleStatusChange(survey.id, "closed")
													}
												>
													<Archive className="mr-2 h-4 w-4" />
													Close
												</DropdownMenuItem>
											)}
											<DropdownMenuSeparator />
											<DropdownMenuItem
												variant="destructive"
												onClick={() => handleDelete(survey.id)}
											>
												<Trash2 className="mr-2 h-4 w-4" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-6 text-muted-foreground text-sm">
										<div className="flex items-center gap-1">
											<Calendar className="h-4 w-4" />
											{new Date(survey.createdAt).toLocaleDateString()}
										</div>
										<div className="flex items-center gap-1">
											<ClipboardList className="h-4 w-4" />/{survey.slug}
										</div>
									</div>
									{survey.owner && (
										<div className="flex items-center gap-2">
											<span className="text-muted-foreground text-xs">
												Created by
											</span>
											<Avatar size="sm">
												<AvatarImage
													src={survey.owner.image || undefined}
													alt={survey.owner.name}
												/>
												<AvatarFallback>
													{survey.owner.name
														.split(" ")
														.map((n) => n[0])
														.join("")
														.toUpperCase()
														.slice(0, 2)}
												</AvatarFallback>
											</Avatar>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Pagination */}
			{surveys.data && surveys.data.pagination.totalPages > 1 && (
				<div className="mt-6 flex justify-center gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={page === 1}
						onClick={() => setPage(page - 1)}
					>
						Previous
					</Button>
					<span className="flex items-center px-4 text-sm">
						Page {page} of {surveys.data.pagination.totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						disabled={page >= surveys.data.pagination.totalPages}
						onClick={() => setPage(page + 1)}
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
}
