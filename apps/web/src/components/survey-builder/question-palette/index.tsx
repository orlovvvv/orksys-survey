"use client";

import type { Question } from "@orksys-survey/db";

import { SurveyBuilderContext } from "../context";
import { useQuestionMutations } from "../hooks/use-question-mutations";
import { CancelDropZone } from "./cancel-drop-zone";
import { questionTypes } from "./constants";
import {
	QuestionTypeButton,
	QuestionTypeIconButton,
} from "./question-type-button";
import { StructureItem } from "./structure-item";

export function QuestionPalette() {
	const send = SurveyBuilderContext.useActorRef().send;
	const survey = SurveyBuilderContext.useSelector((s) => s.context.survey);
	const questions = SurveyBuilderContext.useSelector(
		(s) => s.context.questions,
	);
	const selectedQuestionId = SurveyBuilderContext.useSelector(
		(s) => s.context.selectedQuestionId,
	);

	const { addQuestion } = useQuestionMutations();

	const handleAddQuestion = (type: Question["type"]) => {
		addQuestion(type, (questions || []).length);
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
								onClick={() =>
									send({ type: "SELECT_QUESTION", id: question.id })
								}
								index={index}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
}
