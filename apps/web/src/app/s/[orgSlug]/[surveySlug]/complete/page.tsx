"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

import {
	StatusPage,
	StatusPageDescription,
	StatusPageIcon,
	StatusPageTitle,
} from "@/components/ui/status-page";

interface CompletePageProps {
	searchParams: Promise<{
		title?: string;
		message?: string;
		redirectUrl?: string;
	}>;
}

export default function SurveyCompletePage({
	searchParams,
}: CompletePageProps) {
	const [params, setParams] = useState<{
		title?: string;
		message?: string;
		redirectUrl?: string;
	}>({});

	useEffect(() => {
		searchParams.then(setParams);
	}, [searchParams]);

	const title = params.title || "Thank You!";
	const message =
		params.message || "Your response has been recorded successfully.";
	const redirectUrl = params.redirectUrl;

	// Handle redirect if URL is provided
	useEffect(() => {
		if (redirectUrl) {
			const timer = setTimeout(() => {
				window.location.href = redirectUrl;
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [redirectUrl]);

	return (
		<StatusPage>
			<StatusPageIcon status="success">
				<CheckCircle2 className="size-8 text-success" />
			</StatusPageIcon>
			<StatusPageTitle>{title}</StatusPageTitle>
			<StatusPageDescription>{message}</StatusPageDescription>
			{redirectUrl && (
				<p className="mt-4 text-muted-foreground text-sm">
					Redirecting you shortly...
				</p>
			)}
		</StatusPage>
	);
}
