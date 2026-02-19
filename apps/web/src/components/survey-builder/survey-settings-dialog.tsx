"use client";

import { SurveyEditDialog } from "../survey-settings";
import { useSurveyBuilder } from "./index";

interface SurveySettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SurveySettingsDialog({
	open,
	onOpenChange,
}: SurveySettingsDialogProps) {
	const { survey } = useSurveyBuilder();

	return (
		<SurveyEditDialog
			surveyId={survey.id}
			open={open}
			onOpenChange={onOpenChange}
		/>
	);
}
