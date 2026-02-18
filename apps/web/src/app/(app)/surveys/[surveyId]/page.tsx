"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { use } from "react";

import { SurveyBuilder } from "@/components/survey-builder";
import { orpc } from "@/utils/orpc";

export default function SurveyBuilderPage({
	params,
}: {
	params: Promise<{ surveyId: string }>;
}) {
	const { surveyId } = use(params);

	const survey = useQuery(
		orpc.survey.getById.queryOptions({ input: { id: surveyId } }),
	);

	const questions = useQuery(
		orpc.question.list.queryOptions({ input: { surveyId } }),
	);

	if (survey.isLoading || questions.isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
			</div>
		);
	}

	if (survey.isError || !survey.data) {
		notFound();
	}

	return (
		<SurveyBuilder
			survey={survey.data}
			questions={questions.data || []}
			className="h-full"
		/>
	);
}
