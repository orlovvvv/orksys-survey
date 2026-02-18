"use client";

import type { Question } from "@orksys-survey/db";
import { motion } from "framer-motion";

import { QuestionCardContent } from "../question-card";

interface DropIndicatorProps {
	questionType: Question["type"];
	position: "start" | "end" | "middle";
}

export function DropIndicator({ questionType, position }: DropIndicatorProps) {
	// Create a mock question for the placeholder
	const mockQuestion: Question = {
		id: `temp-drop-${position}`,
		type: questionType,
		title: `New ${questionType.replace("_", " ")}`,
		description: null,
		required: false,
		order: 0,
		surveyId: "temp-survey-id",
		createdAt: new Date(),
		updatedAt: new Date(),
		config: null,
	};

	return (
		<motion.div
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: "auto" }}
			exit={{ opacity: 0, height: 0 }}
			transition={{ duration: 0.15 }}
		>
			<QuestionCardContent question={mockQuestion} isPlaceholder />
		</motion.div>
	);
}
