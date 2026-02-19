"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";
import { client } from "@/utils/orpc";
import type { AnswerValue } from "../context";

export interface ExistingResponse {
	response: {
		id: string;
		surveyId: string;
		respondentId: string | null;
		fingerprint: string | null;
		isComplete: boolean;
		startedAt: Date;
		completedAt: Date | null;
	};
	answers: Array<{
		questionId: string;
		value: unknown;
	}>;
}

export interface UseResponsePersistenceOptions {
	surveyId: string;
	respondentId: string | null;
	answers: Map<string, AnswerValue>;
	fingerprint: string | null;
	enabled?: boolean;
	currentQuestionIndex?: number;
}

export interface UseResponsePersistenceResult {
	existingResponse: ExistingResponse | null;
	isLoadingExisting: boolean;
	isSaving: boolean;
	saveNow: () => Promise<void>;
	lastSavedAt: Date | null;
	saveError: string | null;
}

/**
 * Hook for managing survey response persistence.
 *
 * Handles:
 * - Checking for existing incomplete responses on mount
 * - Auto-saving progress with debouncing
 * - Manual save functionality
 */
export function useResponsePersistence({
	surveyId,
	respondentId,
	answers,
	fingerprint,
	enabled = true,
	currentQuestionIndex = 0,
}: UseResponsePersistenceOptions): UseResponsePersistenceResult {
	const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null);
	const [saveError, setSaveError] = React.useState<string | null>(null);

	// Query for existing response
	const { data: existingResponse, isLoading: isLoadingExisting } = useQuery({
		queryKey: ["response", "getExisting", surveyId, respondentId],
		queryFn: async () => {
			if (!respondentId) return null;
			const result = await client.response.getExistingResponse({
				surveyId,
				respondentId,
			});
			return result as ExistingResponse | null;
		},
		enabled: enabled && !!respondentId,
		staleTime: 0,
		gcTime: 0,
	});

	// Save mutation
	const saveMutation = useMutation({
		mutationFn: async (isComplete: boolean) => {
			if (!respondentId) throw new Error("No respondent ID");

			const answersArray = Array.from(answers.entries()).map(
				([questionId, value]) => ({
					questionId,
					value,
				}),
			);

			return client.response.saveProgress({
				surveyId,
				respondentId,
				fingerprint: fingerprint ?? undefined,
				answers: answersArray,
				currentQuestionIndex,
				isComplete,
				metadata: {
					userAgent: navigator.userAgent,
					language: navigator.language,
					timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				},
			});
		},
		onSuccess: () => {
			setLastSavedAt(new Date());
			setSaveError(null);
		},
		onError: (error) => {
			setSaveError(error.message || "Failed to save progress");
		},
	});

	// Debounced auto-save (5 seconds)
	React.useEffect(() => {
		if (!enabled || !respondentId || answers.size === 0) {
			return;
		}

		const timeoutId = setTimeout(() => {
			saveMutation.mutate(false);
		}, 5000);

		return () => clearTimeout(timeoutId);
	}, [answers, enabled, respondentId, saveMutation]);

	// Manual save function
	const saveNow = React.useCallback(async () => {
		if (!respondentId) return;
		await saveMutation.mutateAsync(false);
	}, [respondentId, saveMutation]);

	return {
		existingResponse: existingResponse ?? null,
		isLoadingExisting,
		isSaving: saveMutation.isPending,
		saveNow,
		lastSavedAt,
		saveError,
	};
}
