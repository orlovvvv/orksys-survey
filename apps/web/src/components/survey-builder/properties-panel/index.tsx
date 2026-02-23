"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { SurveyBuilderContext } from "../context";
import { EmptyPropertiesPanel } from "./empty-properties-panel";
import { QuestionPropertiesPanel } from "./question-properties-panel";

export { EmptyPropertiesPanel } from "./empty-properties-panel";
export { QuestionPropertiesPanel } from "./question-properties-panel";
export { TypeSpecificEditor } from "./type-specific-editor";

export function PropertiesPanel() {
	const questions = SurveyBuilderContext.useSelector(
		(s) => s.context.questions,
	);
	const selectedQuestionId = SurveyBuilderContext.useSelector(
		(s) => s.context.selectedQuestionId,
	);
	const selectedQuestion = useMemo(() => {
		if (!selectedQuestionId || !questions) return null;
		return questions.find((q) => q.id === selectedQuestionId) ?? null;
	}, [questions, selectedQuestionId]);

	return (
		<AnimatePresence mode="wait">
			{!selectedQuestion ? (
				<motion.div
					key="empty"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 20 }}
					transition={{ duration: 0.2 }}
				>
					<EmptyPropertiesPanel />
				</motion.div>
			) : (
				<motion.div
					key={selectedQuestion.id}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 20 }}
					transition={{ duration: 0.2 }}
				>
					<QuestionPropertiesPanel question={selectedQuestion} />
				</motion.div>
			)}
		</AnimatePresence>
	);
}
