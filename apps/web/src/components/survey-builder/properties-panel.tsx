"use client";

import type { Question } from "@orksys-survey/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { orpc } from "@/utils/orpc";
import { useSurveyBuilder } from "./index";
import { LogicBuilder } from "./logic-builder";
import { ChoiceEditor } from "./question-editors/choice-editor";
import { RatingEditor } from "./question-editors/rating-editor";

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

function EmptyPropertiesPanel() {
	return (
		<div className="flex h-full w-72 flex-col border-neutral-100 border-l bg-white">
			<div className="border-neutral-100 border-b p-4">
				<div className="flex items-center justify-between">
					<h3 className="font-bold font-sans text-[10px] text-neutral-900 uppercase tracking-widest">
						Settings
					</h3>
					<Settings className="h-4 w-4 text-neutral-400" />
				</div>
			</div>
			<div className="flex flex-1 items-center justify-center p-6">
				<p className="text-center text-neutral-400 text-sm">
					Select a question to edit its properties
				</p>
			</div>
		</div>
	);
}

interface QuestionPropertiesPanelProps {
	question: Question;
}

function QuestionPropertiesPanel({ question }: QuestionPropertiesPanelProps) {
	const { questions, onQuestionsChange } = useSurveyBuilder();
	const queryClient = useQueryClient();
	const [localQuestion, setLocalQuestion] = useState(question);
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const updateMutation = useMutation(
		orpc.question.update.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["question"] });
			},
			onError: (error) => {
				toast.error(error.message || "Failed to update question");
			},
		}),
	);

	// Sync local state when question changes
	useEffect(() => {
		setLocalQuestion(question);
	}, [question]);

	// Debounced save
	const debouncedSave = (data: Partial<Question>) => {
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
		}
		// Convert null to undefined for API compatibility
		const apiData = Object.fromEntries(
			Object.entries(data).map(([key, value]) => [
				key,
				value === null ? undefined : value,
			]),
		);
		saveTimeoutRef.current = setTimeout(() => {
			updateMutation.mutate({
				id: question.id,
				data: apiData,
			});
		}, 1000);
	};

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
		<div className="flex h-full w-72 flex-col border-neutral-100 border-l bg-white">
			<div className="border-neutral-100 border-b p-4">
				<div className="flex items-center justify-between">
					<h3 className="font-bold font-sans text-[10px] text-neutral-900 uppercase tracking-widest">
						Settings
					</h3>
					{updateMutation.isPending && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
						>
							<Loader2 className="h-4 w-4 animate-spin text-violet-500" />
						</motion.div>
					)}
				</div>
			</div>
			<div className="flex-1 space-y-6 overflow-y-auto p-5">
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
				<motion.div
					className="flex items-center justify-between"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.15 }}
				>
					<div className="flex flex-col">
						<span className="font-semibold text-neutral-900 text-sm">
							Required
						</span>
						<span className="text-neutral-400 text-xs">
							Respondents must answer
						</span>
					</div>
					<Switch
						checked={localQuestion.required}
						onCheckedChange={(checked) =>
							handleFieldChange("required", checked)
						}
					/>
				</motion.div>

				{/* Type-specific editor */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<TypeSpecificEditor
						question={localQuestion}
						onConfigChange={handleConfigChange}
					/>
				</motion.div>

				{/* Logic Section */}
				<motion.div
					className="border-neutral-100 border-t pt-4"
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

interface TypeSpecificEditorProps {
	question: Question;
	onConfigChange: (config: Question["config"]) => void;
}

function TypeSpecificEditor({
	question,
	onConfigChange,
}: TypeSpecificEditorProps) {
	const config = question.config || {};

	switch (question.type) {
		case "multiple_choice":
		case "checkbox":
		case "dropdown":
			return (
				<ChoiceEditor
					config={config}
					onChange={onConfigChange}
					allowMultiple={question.type === "checkbox"}
				/>
			);

		case "rating":
		case "nps":
		case "linear_scale":
			return (
				<RatingEditor
					config={config}
					onChange={onConfigChange}
					type={question.type}
				/>
			);

		case "text":
		case "textarea":
			return (
				<div className="space-y-4">
					<div className="space-y-2">
						<Label className="text-xs uppercase tracking-wide">
							Placeholder
						</Label>
						<Input
							value={config.placeholder || ""}
							onChange={(e) =>
								onConfigChange({ ...config, placeholder: e.target.value })
							}
							placeholder="Enter placeholder text"
						/>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label className="text-xs uppercase tracking-wide">Min</Label>
							<Input
								type="number"
								value={config.minLength || ""}
								onChange={(e) =>
									onConfigChange({
										...config,
										minLength: e.target.value
											? Number(e.target.value)
											: undefined,
									})
								}
								placeholder="0"
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-xs uppercase tracking-wide">Max</Label>
							<Input
								type="number"
								value={config.maxLength || ""}
								onChange={(e) =>
									onConfigChange({
										...config,
										maxLength: e.target.value
											? Number(e.target.value)
											: undefined,
									})
								}
								placeholder="500"
							/>
						</div>
					</div>
				</div>
			);

		default:
			return null;
	}
}
