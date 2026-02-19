"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthCard } from "@/components/auth/auth-card";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";

type VerifyState = "loading" | "success" | "error";

function VerifyEmailFormInner() {
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
			<AuthCard>
				<div className="flex min-h-[28rem] items-center justify-center p-6 md:p-8">
					<Loader />
				</div>
			</AuthCard>
		);
	}

	if (state === "success") {
		return (
			<AuthCard>
				<form className="flex min-h-[28rem] flex-col justify-center p-6 md:p-8">
					<FieldGroup>
						<div className="flex flex-col items-center gap-2 text-center">
							<CheckCircle2 className="size-12 text-green-600" />
							<h1 className="font-semibold text-xl">Email Verified</h1>
							<p className="text-balance text-muted-foreground text-sm">
								Your email has been successfully verified. You can now access
								all features of your account.
							</p>
						</div>
						<Field>
							<Button
								className="w-full"
								onClick={() => (window.location.href = "/settings/profile")}
							>
								Go to Settings
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</AuthCard>
		);
	}

	return (
		<AuthCard>
			<form className="flex min-h-[28rem] flex-col justify-center p-6 md:p-8">
				<FieldGroup>
					<div className="flex flex-col items-center gap-2 text-center">
						<XCircle className="size-12 text-destructive" />
						<h1 className="font-semibold text-xl">Verification Failed</h1>
						<p className="text-balance text-muted-foreground text-sm">
							{errorMessage}
						</p>
					</div>
					<Field>
						<Button
							variant="outline"
							className="w-full"
							onClick={() => router.push("/settings/profile")}
						>
							Back to Settings
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</AuthCard>
	);
}

export default function VerifyEmailForm() {
	return (
		<Suspense
			fallback={
				<AuthCard>
					<div className="flex min-h-[28rem] items-center justify-center p-6 md:p-8">
						<Loader />
					</div>
				</AuthCard>
			}
		>
			<VerifyEmailFormInner />
		</Suspense>
	);
}
