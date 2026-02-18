"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

type VerifyState = "loading" | "success" | "error";

function VerifyEmailForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const [state, setState] = useState<VerifyState>("loading");
	const [errorMessage, setErrorMessage] = useState<string>("");

	useEffect(() => {
		if (!token) {
			setState("error");
			setErrorMessage("No verification token provided.");
			return;
		}

		authClient.verifyEmail(
			{ query: { token } },
			{
				onSuccess: () => {
					setState("success");
					toast.success("Email verified successfully");
				},
				onError: (ctx: { error: { message?: string } }) => {
					setState("error");
					setErrorMessage(
						ctx.error.message ||
							"Failed to verify email. The link may be expired or invalid.",
					);
					toast.error(ctx.error.message || "Failed to verify email");
				},
			},
		);
	}, [token]);

	if (state === "loading") {
		return (
			<Card>
				<CardContent className="flex items-center justify-center py-12">
					<Loader />
				</CardContent>
			</Card>
		);
	}

	if (state === "success") {
		return (
			<Card>
				<CardHeader className="text-center">
					<div className="flex justify-center">
						<CheckCircle2 className="size-12 text-success" />
					</div>
					<CardTitle className="mt-4">Email Verified</CardTitle>
					<CardDescription>
						Your email has been successfully verified. You can now access all
						features of your account.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Button
						className="w-full"
						onClick={() => (window.location.href = "/settings/profile")}
					>
						Go to Settings
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="text-center">
				<div className="flex justify-center">
					<XCircle className="size-12 text-destructive" />
				</div>
				<CardTitle className="mt-4">Verification Failed</CardTitle>
				<CardDescription>{errorMessage}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<Button
					variant="outline"
					className="w-full"
					onClick={() => router.push("/settings/profile")}
				>
					Back to Settings
				</Button>
			</CardContent>
		</Card>
	);
}

export default function VerifyEmailPage() {
	return (
		<Suspense
			fallback={
				<Card>
					<CardContent className="flex items-center justify-center py-12">
						<Loader />
					</CardContent>
				</Card>
			}
		>
			<VerifyEmailForm />
		</Suspense>
	);
}
