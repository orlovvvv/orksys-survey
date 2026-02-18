"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { Suspense, use } from "react";

import { SurveyRunner } from "@/components/survey-runner";
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
			<div className="flex min-h-svh items-center justify-center bg-neutral-50">
				<Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
			</div>
		);
	}

	if (survey.isError || !survey.data) {
		return (
			<div className="flex min-h-svh items-center justify-center bg-neutral-50 p-4">
				<div className="text-center">
					<AlertCircle className="mx-auto h-12 w-12 text-red-500" />
					<h1 className="mt-4 font-semibold text-neutral-900 text-xl">
						Survey Not Found
					</h1>
					<p className="mt-2 text-neutral-600 text-sm">
						This survey may have been removed or is not yet published.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className={isEmbed ? "min-h-svh" : "min-h-svh bg-neutral-50"}>
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
		<div className="flex min-h-svh items-center justify-center bg-neutral-50">
			<Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
		</div>
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
