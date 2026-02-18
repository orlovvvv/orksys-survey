"use client";

import type { Question } from "@orksys-survey/db";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSurveyBuilder } from "../index";
import { LogicBuilder } from "../logic-builder";
import { ToggleField } from "../primitives/toggle-field";
import { useDebouncedSave } from "./hooks/use-debounced-save";
import { TypeSpecificEditor } from "./type-specific-editor";

interface QuestionPropertiesPanelProps {
	question: Question;
}

export function QuestionPropertiesPanel({
	question,
}: QuestionPropertiesPanelProps) {
	const { questions, onQuestionsChange } = useSurveyBuilder();
	const [localQuestion, setLocalQuestion] = useState(question);
	const { debouncedSave, isPending } = useDebouncedSave(question.id);

	// Sync local state when question changes
	useEffect(() => {
		setLocalQuestion(question);
	}, [question]);

	const handleFieldChange = <K extends keyof Question>(
		field: K,
		value: Question[K],
	) => {
		const updated = { ...localQuestion, [field]: value };
		setLocalQuestion(updated);

		// Update parent state
		onQuestionsChange(
			(questions || []).map((q) => (q.id === question.id ? updated : q)),
		);

		// Debounced save to server
		debouncedSave({ [field]: value });
	};

	const handleConfigChange = (config: Question["config"]) => {
		handleFieldChange("config", config);
	};

	return (
		<div className="flex h-full w-72 flex-col border-border border-l bg-card">
			<div className="border-border border-b p-4">
				<div className="flex items-center justify-between">
					<h3 className="font-bold font-sans text-[10px] text-foreground uppercase tracking-widest">
						Settings
					</h3>
					{isPending && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
						>
							<Loader2 className="h-4 w-4 animate-spin text-primary" />
						</motion.div>
					)}
				</div>
			</div>
			<div className="flex-1 space-y-6 overflow-y-auto p-4">
				{/* Title */}
				<motion.div
					className="space-y-2"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.05 }}
				>
					<Label className="text-xs uppercase tracking-wide">Title</Label>
					<Input
						value={localQuestion.title}
						onChange={(e) => handleFieldChange("title", e.target.value)}
						placeholder="Question title"
					/>
				</motion.div>

				{/* Description */}
				<motion.div
					className="space-y-2"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<Label className="text-xs uppercase tracking-wide">Description</Label>
					<Textarea
						value={localQuestion.description || ""}
						onChange={(e) =>
							handleFieldChange("description", e.target.value || null)
						}
						placeholder="Optional description"
						rows={2}
					/>
				</motion.div>

				{/* Required Toggle */}
				<ToggleField
					checked={localQuestion.required}
					onCheckedChange={(checked) => handleFieldChange("required", checked)}
					label="Required"
					description="Respondents must answer"
					className="[--animation-delay:150ms]"
				/>

				{/* Type-specific editor */}
				<TypeSpecificEditor
					question={localQuestion}
					onConfigChange={handleConfigChange}
				/>

				{/* Logic Section */}
				<motion.div
					className="border-border border-t pt-4"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.25 }}
				>
					<LogicBuilder
						surveyId={question.surveyId}
						questions={questions}
						selectedQuestionId={question.id}
					/>
				</motion.div>
			</div>
		</div>
	);
}
