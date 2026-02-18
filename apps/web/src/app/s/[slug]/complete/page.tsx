"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

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
		<div className="flex min-h-svh items-center justify-center bg-neutral-50 p-4">
			<div className="w-full max-w-md text-center">
				<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
					<CheckCircle2 className="h-8 w-8 text-green-600" />
				</div>
				<h1 className="font-semibold text-2xl text-neutral-900">{title}</h1>
				<p className="mt-3 text-neutral-600">{message}</p>
				{redirectUrl && (
					<p className="mt-4 text-neutral-500 text-sm">
						Redirecting you shortly...
					</p>
				)}
			</div>
		</div>
	);
}
