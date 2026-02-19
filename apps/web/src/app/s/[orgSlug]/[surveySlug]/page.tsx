"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { Suspense, use } from "react";

import { SurveyRunner } from "@/components/survey-runner";
import {
	StatusPage,
	StatusPageDescription,
	StatusPageIcon,
} from "@/components/ui/status-page";
import { orpc } from "@/utils/orpc";

function SurveyRunnerContent({
	orgSlug,
	surveySlug,
	isEmbed,
}: {
	orgSlug: string;
	surveySlug: string;
	isEmbed: boolean;
}) {
	const survey = useQuery(
		orpc.response.getSurveyForRunner.queryOptions({
			input: { orgSlug, surveySlug },
		}),
	);

	if (survey.isLoading) {
		return (
			<StatusPage variant={isEmbed ? "embed" : "default"}>
				<StatusPageIcon status="loading" />
			</StatusPage>
		);
	}

	if (survey.isError || !survey.data) {
		return (
			<StatusPage variant={isEmbed ? "embed" : "default"}>
				<StatusPageIcon status="error">
					<AlertCircle className="size-8 text-destructive" />
				</StatusPageIcon>
				<StatusPageDescription>
					This survey may have been removed or is not yet published.
				</StatusPageDescription>
			</StatusPage>
		);
	}

	return (
		<div className={isEmbed ? "min-h-svh" : "min-h-svh bg-background"}>
			<SurveyRunner
				survey={survey.data.survey}
				questions={survey.data.questions}
				logicRules={survey.data.logicRules}
				className={isEmbed ? "" : "min-h-svh"}
			/>
		</div>
	);
}

function LoadingFallback() {
	return (
		<StatusPage>
			<StatusPageIcon status="loading" />
		</StatusPage>
	);
}

export default function SurveyRunnerPage({
	params,
	searchParams,
}: {
	params: Promise<{ orgSlug: string; surveySlug: string }>;
	searchParams: Promise<{ embed?: string }>;
}) {
	const { orgSlug, surveySlug } = use(params);
	const { embed } = use(searchParams);
	const isEmbed = embed === "true" || embed === "1";

	return (
		<Suspense fallback={<LoadingFallback />}>
			<SurveyRunnerContent
				orgSlug={orgSlug}
				surveySlug={surveySlug}
				isEmbed={isEmbed}
			/>
		</Suspense>
	);
}
