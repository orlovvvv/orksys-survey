"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSurveyRunner } from "./context";

function OneAtATimeNavigation() {
	const {
		canGoBack,
		canGoNext,
		isSubmitting,
		goBack,
		goNext,
		submit,
		currentError,
	} = useSurveyRunner();

	return (
		<div className="border-border border-t bg-card px-6 py-4">
			<div className="mx-auto max-w-2xl space-y-3">
				{currentError && (
					<div className="rounded-lg bg-destructive/10 px-4 py-2 text-center text-destructive text-sm">
						{currentError}
					</div>
				)}
				<div className="flex items-center justify-between gap-4">
					<Button
						variant="ghost"
						onClick={goBack}
						disabled={!canGoBack}
						className="text-muted-foreground"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>

					{canGoNext ? (
						<Button onClick={goNext} className="bg-primary hover:bg-primary/90">
							Next
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					) : (
						<Button
							onClick={submit}
							disabled={isSubmitting}
							className="bg-primary hover:bg-primary/90"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Submitting...
								</>
							) : (
								"Submit"
							)}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

function ListModeNavigation() {
	const { isSubmitting, submit, validateAllQuestions, visibleQuestions } =
		useSurveyRunner();

	const [validationErrors, setValidationErrors] = useState<Map<string, string>>(
		new Map(),
	);

	const handleSubmit = async () => {
		const errors = validateAllQuestions();
		if (errors.size > 0) {
			setValidationErrors(errors);
			return;
		}
		setValidationErrors(new Map());
		await submit();
	};

	const hasErrors = validationErrors.size > 0;
	const errorMessage = hasErrors
		? `Please answer all required questions (${validationErrors.size} missing)`
		: null;

	return (
		<div className="border-border border-t bg-card px-6 py-4">
			<div className="mx-auto max-w-2xl space-y-3">
				{errorMessage && (
					<div className="rounded-lg bg-destructive/10 px-4 py-2 text-center text-destructive text-sm">
						{errorMessage}
					</div>
				)}
				<div className="flex items-center justify-center">
					<Button
						onClick={handleSubmit}
						disabled={isSubmitting}
						className="bg-primary hover:bg-primary/90"
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Submitting...
							</>
						) : (
							`Submit (${visibleQuestions.length} questions)`
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}

export function RunnerNavigation() {
	const { displayMode } = useSurveyRunner();

	if (displayMode === "list") {
		return <ListModeNavigation />;
	}

	return <OneAtATimeNavigation />;
}
