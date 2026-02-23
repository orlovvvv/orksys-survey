"use client";

import type { Question } from "@orksys-survey/db";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SurveyBuilderContext } from "../context";
import { LogicBuilder } from "../logic-builder";
import { ToggleField } from "../primitives/toggle-field";
import { TypeSpecificEditor } from "./type-specific-editor";

interface QuestionPropertiesPanelProps {
	question: Question;
}

export function QuestionPropertiesPanel({
	question,
}: QuestionPropertiesPanelProps) {
	const send = SurveyBuilderContext.useActorRef().send;
	const questions = SurveyBuilderContext.useSelector(
		(s) => s.context.questions,
	);
	const [localQuestion, setLocalQuestion] = useState(question);
	const prevQuestionIdRef = useRef(question.id);

	// Sync local state only when switching to a different question
	useEffect(() => {
		if (prevQuestionIdRef.current !== question.id) {
			setLocalQuestion(question);
			prevQuestionIdRef.current = question.id;
		}
	}, [question.id]);

	const handleFieldChange = <K extends keyof Question>(
		field: K,
		value: Question[K],
	) => {
		const updated = { ...localQuestion, [field]: value };
		setLocalQuestion(updated);

		// Update parent state via XState event
		send({
			type: "QUESTION_UPDATE",
			id: question.id,
			updates: { [field]: value },
		});
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
					onFieldChange={handleFieldChange}
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
