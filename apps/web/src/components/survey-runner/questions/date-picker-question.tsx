"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useQuestion } from "./question-context";
import { QuestionField } from "./question-field";

export function DatePickerQuestion() {
	const { question, value, onChange } = useQuestion();
	const date = value ? new Date(value) : undefined;

	return (
		<QuestionField>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={"outline"}
						className={cn(
							"w-full justify-start text-left font-normal",
							!date && "text-muted-foreground",
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date ? format(date, "PPP") : <span>Pick a date</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={date}
						onSelect={(d) => onChange(d?.toISOString())}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		</QuestionField>
	);
}
