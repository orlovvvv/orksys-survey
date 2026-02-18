"use client";

import type { Question } from "@orksys-survey/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { orpc } from "@/utils/orpc";

import { useSurveyBuilder } from "..";
import { CancelDropZone } from "./cancel-drop-zone";
import { questionTypes } from "./constants";
import {
	QuestionTypeButton,
	QuestionTypeIconButton,
} from "./question-type-button";
import { StructureItem } from "./structure-item";

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
		<div className="relative flex h-full w-64 flex-col overflow-y-auto border-border border-r bg-card">
			<CancelDropZone />
			<div className="p-4">
				<h3 className="mb-4 font-bold font-sans text-[10px] text-foreground uppercase tracking-widest">
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

				<h3 className="mt-6 mb-4 font-bold font-sans text-[10px] text-foreground uppercase tracking-widest">
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

				<h3 className="mt-6 mb-4 font-bold font-sans text-[10px] text-foreground uppercase tracking-widest">
					Structure
				</h3>
				<div className="space-y-1">
					{(questions || []).length === 0 ? (
						<p className="py-4 text-center text-muted-foreground text-xs">
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
