"use client";

import { CheckCircle2, ExternalLink } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface SurveyOrganization {
	id: string;
	name: string;
	slug: string;
	logo: string | null;
}

interface SurveyWithOrg {
	slug: string;
	settings?: { thankYouMessage?: string; redirectUrl?: string } | null;
	organization?: SurveyOrganization;
}

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { useSurveyRunner } from "./context";

interface RunnerCompleteProps {
	message?: string;
	redirectUrl?: string;
}

export function RunnerComplete({ message, redirectUrl }: RunnerCompleteProps) {
	const { survey } = useSurveyRunner();
	const router = useRouter();
	const [countdown, setCountdown] = useState(5);

	const orgSlug = (survey as SurveyWithOrg).organization?.slug;
	const surveySlug = survey.slug;

	// Use props if provided, otherwise fall back to survey settings
	const thankYouMessage =
		message ??
		survey.settings?.thankYouMessage ??
		"Thank you for completing this survey!";
	const finalRedirectUrl = redirectUrl ?? survey.settings?.redirectUrl;

	// Auto-redirect countdown
	useEffect(() => {
		if (!finalRedirectUrl) return;

		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					window.location.href = finalRedirectUrl;
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [finalRedirectUrl]);

	const handleRedirectNow = () => {
		if (finalRedirectUrl) {
			window.location.href = finalRedirectUrl;
		}
	};

	return (
		<div className="flex min-h-[50vh] items-center justify-center px-4 py-6">
			<div className="mx-auto w-full max-w-lg">
				<Card>
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-success/10">
							<CheckCircle2 className="size-8 text-success" />
						</div>
						<CardTitle className="text-2xl">Survey Complete</CardTitle>
					</CardHeader>

					<CardContent className="text-center">
						<p className="text-muted-foreground">{thankYouMessage}</p>

						{finalRedirectUrl && countdown > 0 && (
							<p className="mt-4 text-muted-foreground text-sm">
								Redirecting in {countdown} seconds...
							</p>
						)}
					</CardContent>

					<CardFooter className="flex flex-col gap-2">
						{finalRedirectUrl && (
							<Button
								variant="default"
								className="w-full"
								onClick={handleRedirectNow}
							>
								Continue
								<ExternalLink className="ml-2 size-4" />
							</Button>
						)}

						<Button
							variant="outline"
							className="w-full"
							onClick={() =>
								orgSlug && router.push(`/s/${orgSlug}/${surveySlug}` as Route)
							}
							disabled={!orgSlug}
						>
							Back to Survey
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
