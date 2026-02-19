"use client";

import * as React from "react";

/**
 * Generates a unique respondent token for survey response tracking.
 * The token is stored in localStorage with a survey-specific key and persists
 * across browser sessions, allowing users to resume incomplete surveys.
 *
 * @param surveyId - The ID of the survey
 * @returns An object with respondentId and isLoading state
 */
export function useRespondentToken(surveyId: string): {
	respondentId: string | null;
	isLoading: boolean;
} {
	const [respondentId, setRespondentId] = React.useState<string | null>(null);
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		if (typeof window === "undefined") {
			setIsLoading(false);
			return;
		}

		const storageKey = `survey_respondent_${surveyId}`;

		// Check for existing token
		const existingToken = localStorage.getItem(storageKey);

		if (existingToken) {
			setRespondentId(existingToken);
			setIsLoading(false);
			return;
		}

		// Generate new token
		const newToken = generateRespondentId();
		localStorage.setItem(storageKey, newToken);
		setRespondentId(newToken);
		setIsLoading(false);
	}, [surveyId]);

	return { respondentId, isLoading };
}

/**
 * Generates a unique respondent ID using timestamp and random components.
 */
function generateRespondentId(): string {
	const timestamp = Date.now().toString(36);
	const randomPart =
		crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 15);
	return `resp_${timestamp}_${randomPart}`;
}
