"use client";

import { AlertCircle } from "lucide-react";
import * as React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { useSendVerificationEmail } from "../hooks";

export interface EmailVerificationBannerProps {
	email: string;
	emailVerified: boolean | Date | null;
}

export function EmailVerificationBanner({
	email,
	emailVerified,
}: EmailVerificationBannerProps) {
	const sendVerificationMutation = useSendVerificationEmail();
	const [lastSent, setLastSent] = React.useState<Date | null>(null);

	// Don't show if email is verified
	if (emailVerified === true || emailVerified instanceof Date) {
		return null;
	}

	const handleResend = async () => {
		await sendVerificationMutation.mutateAsync({ email });
		setLastSent(new Date());
	};

	// Calculate if we can resend (wait 60 seconds)
	const canResend = !lastSent || Date.now() - lastSent.getTime() > 60 * 1000;

	return (
		<Alert variant="destructive">
			<AlertCircle className="size-4" />
			<AlertTitle>Email Not Verified</AlertTitle>
			<AlertDescription className="flex items-center justify-between gap-4">
				<span className="text-sm">
					Please verify your email address to access all features.
				</span>
				<Button
					variant="outline"
					size="sm"
					onClick={handleResend}
					disabled={!canResend || sendVerificationMutation.isPending}
					className="shrink-0"
				>
					{sendVerificationMutation.isPending
						? "Sending..."
						: canResend
							? "Resend Email"
							: "Resend in 60s"}
				</Button>
			</AlertDescription>
		</Alert>
	);
}
