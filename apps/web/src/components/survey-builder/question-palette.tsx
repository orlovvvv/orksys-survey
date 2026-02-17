"use client";

import { useDraggable } from "@dnd-kit/core";
import type { Question } from "@orksys-survey/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
	Calendar,
	CheckSquare,
	ChevronsUpDown,
	ClipboardList,
	FileText,
	Hash,
	ListChecks,
	Mail,
	MoreHorizontal,
	Phone,
	Star,
	Text,
	TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { orpc } from "@/utils/orpc";

import { useSurveyBuilder } from "./index";

interface QuestionTypeConfig {
	type: Question["type"];
	label: string;
	icon: React.ElementType;
	description: string;
}

const questionTypes: QuestionTypeConfig[] = [
	{
		type: "text",
		label: "Short Text",
		icon: Text,
		description: "Single line text input",
	},
	{
		type: "textarea",
		label: "Long Text",
		icon: FileText,
		description: "Multi-line text area",
	},
	{
		type: "multiple_choice",
		label: "Multiple Choice",
		icon: CheckSquare,
		description: "Single selection from options",
	},
	{
		type: "checkbox",
		label: "Checkboxes",
		icon: ListChecks,
		description: "Multiple selections allowed",
	},
	{
		type: "dropdown",
		label: "Dropdown",
		icon: ChevronsUpDown,
		description: "Dropdown selection list",
	},
	{
		type: "rating",
		label: "Rating",
		icon: Star,
		description: "Star or number rating",
	},
	{
		type: "nps",
		label: "NPS",
		icon: TrendingUp,
		description: "Net Promoter Score 0-10",
	},
	{
		type: "linear_scale",
		label: "Linear Scale",
		icon: Hash,
		description: "Custom range scale",
	},
	{
		type: "date",
		label: "Date",
		icon: Calendar,
		description: "Date picker",
	},
	{
		type: "email",
		label: "Email",
		icon: Mail,
		description: "Email address input",
	},
	{
		type: "phone",
		label: "Phone",
		icon: Phone,
		description: "Phone number input",
	},
	{
		type: "file_upload",
		label: "File Upload",
		icon: ClipboardList,
		description: "File upload field",
	},
];

export function QuestionPalette() {
	const {
		survey,
		questions,
		selectedQuestionId,
		setSelectedQuestionId,
		onQuestionsChange,
	} = useSurveyBuilder();
	const queryClient = useQueryClient();

	const createMutation = useMutation(
		orpc.question.create.mutationOptions({
			onSuccess: (newQuestion) => {
				onQuestionsChange([...(questions || []), newQuestion]);
				setSelectedQuestionId(newQuestion.id);
				queryClient.invalidateQueries({ queryKey: ["question"] });
				toast.success("Question added");
			},
			onError: (error) => {
				toast.error(error.message || "Failed to create question");
			},
		}),
	);

	const handleAddQuestion = (type: Question["type"]) => {
		createMutation.mutate({
			surveyId: survey.id,
			type,
			title: `New ${questionTypes.find((q) => q.type === type)?.label || type}`,
			order: (questions || []).length,
		});
	};

	return (
		<div className="flex h-full w-64 flex-col overflow-y-auto border-neutral-100 border-r bg-white">
			<div className="p-4">
				<h3 className="mb-4 font-bold font-sans text-[10px] text-neutral-900 uppercase tracking-widest">
					Question Types
				</h3>
				<div className="space-y-1">
					{questionTypes.slice(0, 4).map((qType, index) => (
						<QuestionTypeButton
							key={qType.type}
							config={qType}
							onClick={() => handleAddQuestion(qType.type)}
							disabled={createMutation.isPending}
							index={index}
						/>
					))}
				</div>

				<h3 className="mt-6 mb-4 font-bold font-sans text-[10px] text-neutral-900 uppercase tracking-widest">
					More Types
				</h3>
				<div className="grid grid-cols-2 gap-1">
					{questionTypes.slice(4).map((qType, index) => (
						<QuestionTypeIconButton
							key={qType.type}
							config={qType}
							onClick={() => handleAddQuestion(qType.type)}
							disabled={createMutation.isPending}
							index={index}
						/>
					))}
				</div>

				<h3 className="mt-6 mb-4 font-bold font-sans text-[10px] text-neutral-900 uppercase tracking-widest">
					Structure
				</h3>
				<div className="space-y-1">
					{(questions || []).length === 0 ? (
						<p className="py-4 text-center text-neutral-400 text-xs">
							No questions yet
						</p>
					) : (
						(questions || []).map((question, index) => (
							<StructureItem
								key={question.id}
								number={index + 1}
								label={question.title}
								isActive={selectedQuestionId === question.id}
								onClick={() => setSelectedQuestionId(question.id)}
								index={index}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
}

interface QuestionTypeButtonProps {
	config: QuestionTypeConfig;
	onClick: () => void;
	disabled?: boolean;
	index: number;
}

function QuestionTypeButton({
	config,
	onClick,
	disabled,
	index,
}: QuestionTypeButtonProps) {
	const Icon = config.icon;

	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
		id: `palette-${config.type}`,
		data: {
			questionType: config.type,
		},
	});

	return (
		<motion.button
			ref={setNodeRef}
			type="button"
			onClick={onClick}
			disabled={disabled}
			{...attributes}
			{...listeners}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
			transition={{ duration: 0.2, delay: index * 0.03 }}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			className="group flex w-full cursor-grab items-center gap-3 rounded-xl border border-transparent bg-white p-3 text-left transition-colors hover:border-neutral-200 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
		>
			<Icon className="h-5 w-5 shrink-0 text-neutral-400 transition-colors group-hover:text-violet-500" />
			<div className="min-w-0 flex-1">
				<span className="block font-medium text-neutral-700 text-sm">
					{config.label}
				</span>
				<span className="block truncate text-neutral-400 text-xs">
					{config.description}
				</span>
			</div>
		</motion.button>
	);
}

interface QuestionTypeIconButtonProps {
	config: QuestionTypeConfig;
	onClick: () => void;
	disabled?: boolean;
	index: number;
}

function QuestionTypeIconButton({
	config,
	onClick,
	disabled,
	index,
}: QuestionTypeIconButtonProps) {
	const Icon = config.icon;

	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
		id: `palette-icon-${config.type}`,
		data: {
			questionType: config.type,
		},
	});

	return (
		<motion.button
			ref={setNodeRef}
			type="button"
			onClick={onClick}
			disabled={disabled}
			{...attributes}
			{...listeners}
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
			transition={{ duration: 0.2, delay: index * 0.02 }}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			className="group flex flex-col items-center gap-1 rounded-lg border border-transparent bg-white p-2 text-center transition-colors hover:border-neutral-200 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
			title={config.label}
		>
			<Icon className="h-4 w-4 text-neutral-400 transition-colors group-hover:text-violet-500" />
			<span className="truncate text-[10px] text-neutral-600">
				{config.label}
			</span>
		</motion.button>
	);
}

interface StructureItemProps {
	number: number;
	label: string;
	isActive?: boolean;
	onClick: () => void;
	index: number;
}

function StructureItem({
	number,
	label,
	isActive = false,
	onClick,
	index,
}: StructureItemProps) {
	return (
		<motion.button
			type="button"
			onClick={onClick}
			initial={{ opacity: 0, x: -10 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.2, delay: index * 0.03 }}
			className={cn(
				"flex w-full items-center justify-between rounded-lg p-2 font-medium text-sm transition-colors",
				isActive
					? "border border-violet-500/20 bg-violet-50 text-neutral-900"
					: "text-neutral-600 hover:bg-neutral-50",
			)}
		>
			<div className="flex items-center gap-2">
				<motion.div
					layoutId={`structure-number-${number}`}
					className={cn(
						"flex h-5 w-5 items-center justify-center rounded text-[10px]",
						isActive
							? "bg-violet-500 text-white"
							: "bg-neutral-200 text-neutral-600",
					)}
				>
					{number}
				</motion.div>
				<span className="truncate">{label}</span>
			</div>
			{isActive && (
				<MoreHorizontal className="h-4 w-4 shrink-0 text-neutral-400" />
			)}
		</motion.button>
	);
}
