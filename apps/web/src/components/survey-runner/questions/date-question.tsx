"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { QuestionField } from "./question-field";
import type { TextQuestionProps } from "./types";

export function DateQuestion({ question, value, onChange }: TextQuestionProps) {
	const selectedDate = value ? new Date(value) : undefined;

	const handleSelect = (date: Date | undefined) => {
		onChange(date?.toISOString() ?? "");
	};

	return (
		<QuestionField question={question} error={undefined}>
			<Popover>
				<PopoverTrigger
					className={cn(
						"flex w-full items-center justify-start gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-left text-sm outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
						!value && "text-muted-foreground",
					)}
				>
					<CalendarIcon className="h-4 w-4" />
					{selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={selectedDate}
						onSelect={handleSelect}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		</QuestionField>
	);
}
