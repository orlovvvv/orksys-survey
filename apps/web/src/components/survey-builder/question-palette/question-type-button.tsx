"use client";

import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { QuestionTypeConfig } from "./constants";

interface QuestionTypeButtonProps {
	config: QuestionTypeConfig;
	onClick: () => void;
	disabled?: boolean;
	index: number;
}

export function QuestionTypeButton({
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
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2, delay: index * 0.03 }}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			className={cn(
				"group flex w-full cursor-grab items-center gap-3 rounded-xl border border-transparent bg-card p-3 text-left transition-all hover:border-border hover:bg-muted/50 active:scale-95 active:bg-primary/10 active:ring-2 active:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
				isDragging && "bg-primary/10 ring-2 ring-ring",
			)}
		>
			<Icon className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
			<div className="min-w-0 flex-1">
				<span className="block font-medium text-foreground text-sm">
					{config.label}
				</span>
				<span className="block truncate text-muted-foreground text-xs">
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

export function QuestionTypeIconButton({
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
			className="group flex flex-col items-center gap-1 rounded-xl border border-transparent bg-card p-2 text-center transition-colors hover:border-border hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
			title={config.label}
		>
			<Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
			<span className="truncate text-[10px] text-muted-foreground">
				{config.label}
			</span>
		</motion.button>
	);
}
