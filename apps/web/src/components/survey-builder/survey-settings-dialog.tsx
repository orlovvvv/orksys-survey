"use client";

import { SurveyEditDialog } from "../survey-settings";
import { SurveyBuilderContext } from "./context";

interface SurveySettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SurveySettingsDialog({
	open,
	onOpenChange,
}: SurveySettingsDialogProps) {
	const survey = SurveyBuilderContext.useSelector((s) => s.context.survey);

	return (
		<SurveyEditDialog
			surveyId={survey.id}
			open={open}
			onOpenChange={onOpenChange}
		/>
	);
}
