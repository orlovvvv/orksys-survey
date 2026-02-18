"use client";

import type { Question, Survey } from "@orksys-survey/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client, orpc } from "@/utils/orpc";

export interface QuestionMutationParams {
	survey: Survey;
	onQuestionCreated?: (question: Question) => void;
	onQuestionCreateError?: () => void;
}

export function useQuestionMutations({
	survey,
	onQuestionCreated,
	onQuestionCreateError,
}: QuestionMutationParams) {
	const queryClient = useQueryClient();

	// Reorder mutation
	const reorderMutation = useMutation(
		orpc.question.reorder.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["question"] });
			},
			onError: (error) => {
				toast.error(error.message || "Failed to reorder questions");
			},
		}),
	);

	// Create question mutation with optimistic update
	const createQuestion = useMutation({
		mutationFn: async (params: {
			questionType: Question["type"];
			insertIndex: number;
			currentQuestions: Question[];
			onOptimisticUpdate: (optimisticQuestions: Question[]) => void;
			tempId: string;
		}) => {
			const { questionType, insertIndex, currentQuestions } = params;

			// Optimistic update
			const tempId = params.tempId;
			const optimisticQuestion: Question = {
				id: tempId,
				type: questionType,
				title: `New ${questionType}`,
				surveyId: survey.id,
				order: insertIndex,
				required: false,
				description: null,
				config: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const optimisticQuestions = [
				...currentQuestions.slice(0, insertIndex).map((q, i) => ({
					...q,
					order: i,
				})),
				{ ...optimisticQuestion, order: insertIndex },
				...currentQuestions
					.slice(insertIndex)
					.map((q, i) => ({ ...q, order: insertIndex + 1 + i })),
			];

			params.onOptimisticUpdate(optimisticQuestions);

			// Create question on server
			const { questionTypeLabels } = await import("../question-card/constants");
			const newQuestion = await client.question.create({
				surveyId: survey.id,
				type: questionType,
				title: `New ${questionTypeLabels[questionType] || questionType}`,
				order: insertIndex,
			});

			return { newQuestion, tempId, currentQuestions, insertIndex };
		},
		onSuccess: ({ newQuestion, tempId, currentQuestions, insertIndex }) => {
			// Replace optimistic question with real one
			onQuestionCreated?.(newQuestion);

			queryClient.invalidateQueries({ queryKey: ["question"] });

			// Reorder all questions on backend to ensure consistency
			const finalQuestions = [
				...currentQuestions
					.slice(0, insertIndex)
					.map((q, i) => ({ ...q, order: i })),
				{ ...newQuestion, order: insertIndex },
				...currentQuestions
					.slice(insertIndex)
					.map((q, i) => ({ ...q, order: insertIndex + 1 + i })),
			];

			reorderMutation.mutate({
				questions: finalQuestions.map((q) => ({
					id: q.id,
					order: q.order,
				})),
			});

			toast.success("Question added");
		},
		onError: (error, _variables) => {
			onQuestionCreateError?.();
			toast.error(error.message || "Failed to create question");
		},
	});

	return {
		reorderMutation,
		createQuestion,
	};
}
