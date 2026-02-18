"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSurveyBuilder } from "../index";
import { EmptyPropertiesPanel } from "./empty-properties-panel";
import { QuestionPropertiesPanel } from "./question-properties-panel";

export { EmptyPropertiesPanel } from "./empty-properties-panel";
export { useDebouncedSave } from "./hooks/use-debounced-save";
export { QuestionPropertiesPanel } from "./question-properties-panel";
export { TypeSpecificEditor } from "./type-specific-editor";

export function PropertiesPanel() {
	const { questions, selectedQuestionId } = useSurveyBuilder();
	const selectedQuestion = (questions || []).find(
		(q) => q.id === selectedQuestionId,
	);

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
