"use client";

import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useDashboardFilters } from "@/components/dashboard/providers";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function SurveyFilter({ className }: { className?: string }) {
	const { availableSurveys, selectedSurveys, setSelectedSurveys } =
		useDashboardFilters();
	const [open, setOpen] = useState(false);

	const hasSelection = selectedSurveys.length > 0;
	const allSelected = selectedSurveys.length === availableSurveys.length;

	const handleToggleSurvey = (surveyId: string) => {
		if (selectedSurveys.includes(surveyId)) {
			setSelectedSurveys(selectedSurveys.filter((id) => id !== surveyId));
		} else {
			setSelectedSurveys([...selectedSurveys, surveyId]);
		}
	};

	const handleSelectAll = () => {
		if (allSelected) {
			setSelectedSurveys([]);
		} else {
			setSelectedSurveys(availableSurveys.map((s) => s.id));
		}
	};

	const handleClear = () => {
		setSelectedSurveys([]);
	};

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<Select
				open={open}
				onOpenChange={setOpen}
				value={hasSelection ? "custom" : "all"}
				onValueChange={(value) => {
					if (value === "all") {
						setSelectedSurveys([]);
					}
				}}
			>
				<SelectTrigger size="sm" className="w-full min-w-[180px] max-w-[250px]">
					<SelectValue>
						{hasSelection ? (
							<span className="truncate">
								{selectedSurveys.length}{" "}
								{selectedSurveys.length === 1 ? "survey" : "surveys"} selected
							</span>
						) : (
							"All Surveys"
						)}
					</SelectValue>
				</SelectTrigger>
				<SelectContent align="start" sideOffset={4} className="w-56 p-0">
					<Command>
						<div className="flex items-center border-b px-3">
							<CommandInput
								placeholder="Search surveys..."
								className="h-9 border-0 shadow-none focus-visible:ring-0"
							/>
							{hasSelection && (
								<button
									type="button"
									onClick={handleClear}
									className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
								>
									<XIcon className="h-4 w-4" />
								</button>
							)}
						</div>
						<CommandList>
							<CommandEmpty>No surveys found.</CommandEmpty>
							<CommandGroup>
								<CommandItem
									onSelect={handleSelectAll}
									className="cursor-pointer"
								>
									<div
										className={cn(
											"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
											allSelected
												? "bg-primary text-primary-foreground"
												: "opacity-50 [&_svg]:invisible",
										)}
									>
										<CheckIcon className="h-3 w-3" />
									</div>
									<span>All Surveys</span>
								</CommandItem>
								{availableSurveys.map((survey) => {
									const isSelected = selectedSurveys.includes(survey.id);
									return (
										<CommandItem
											key={survey.id}
											onSelect={() => handleToggleSurvey(survey.id)}
											className="cursor-pointer"
										>
											<div
												className={cn(
													"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
													isSelected
														? "bg-primary text-primary-foreground"
														: "opacity-50 [&_svg]:invisible",
												)}
											>
												<CheckIcon className="h-3 w-3" />
											</div>
											<span className="truncate">{survey.title}</span>
										</CommandItem>
									);
								})}
							</CommandGroup>
						</CommandList>
					</Command>
				</SelectContent>
			</Select>
		</div>
	);
}
