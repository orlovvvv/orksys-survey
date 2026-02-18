"use client";

import type { Question } from "@orksys-survey/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";

import { orpc } from "@/utils/orpc";

export function useDebouncedSave(questionId: string) {
	const queryClient = useQueryClient();
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
				id: questionId,
				data: apiData,
			});
		}, 1000);
	};

	return {
		debouncedSave,
		isPending: updateMutation.isPending,
	};
}
