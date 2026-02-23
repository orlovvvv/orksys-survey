"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useQuestion } from "./question-context";
import { QuestionField } from "./question-field";

export function DropdownQuestion() {
	const { question, value, onChange } = useQuestion();
	const [open, setOpen] = React.useState(false);
	const options = question.config?.options || [];
	const isSearchable =
		question.config?.searchable || question.type === "combobox";

	const selectedLabel = options.find((opt) => opt.value === value)?.label;

	if (isSearchable) {
		return (
			<QuestionField>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className="w-full justify-between"
						>
							{selectedLabel ||
								question.config?.placeholder ||
								"Select an option..."}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-full p-0" align="start">
						<Command>
							<CommandInput placeholder="Search option..." />
							<CommandList>
								<CommandEmpty>No option found.</CommandEmpty>
								<CommandGroup>
									{options.map((option) => (
										<CommandItem
											key={option.value}
											value={option.value}
											onSelect={(currentValue) => {
												onChange(currentValue === value ? "" : currentValue);
												setOpen(false);
											}}
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													value === option.value ? "opacity-100" : "opacity-0",
												)}
											/>
											{option.label}
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</QuestionField>
		);
	}

	return (
		<QuestionField>
			<Select value={value || ""} onValueChange={onChange}>
				<SelectTrigger className="w-full">
					<SelectValue
						placeholder={question.config?.placeholder || "Select an option"}
					/>
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</QuestionField>
	);
}
