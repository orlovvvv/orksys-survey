"use client";

import { Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { AuthCard } from "@/components/auth/auth-card";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

function ResetPasswordFormInner() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<{ password?: string; confirm?: string }>(
		{},
	);
	const [generalError, setGeneralError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setGeneralError("");

		// Validate passwords
		const passwordSchema = z
			.string()
			.min(8, "Password must be at least 8 characters");

		const passwordResult = passwordSchema.safeParse(password);
		if (!passwordResult.success) {
			setErrors({ password: passwordResult.error.issues[0].message });
			return;
		}

		if (password !== confirmPassword) {
			setErrors({ confirm: "Passwords do not match" });
			return;
		}

		if (!token) {
			setGeneralError(
				"Invalid or expired reset token. Please request a new one.",
			);
			return;
		}

		setIsSubmitting(true);

		await authClient.resetPassword(
			{ newPassword: password, token },
			{
				onSuccess: () => {
					toast.success("Password reset successfully");
					router.push("/login");
				},
				onError: (ctx: { error: { message?: string } }) => {
					setGeneralError(
						ctx.error.message ||
							"Failed to reset password. The link may be expired.",
					);
					toast.error(ctx.error.message || "Failed to reset password");
				},
			},
		);

		setIsSubmitting(false);
	};

	if (isSubmitting) {
		return (
			<AuthCard>
				<div className="flex min-h-[28rem] items-center justify-center p-6 md:p-8">
					<Loader />
				</div>
			</AuthCard>
		);
	}

	return (
		<AuthCard>
			<form
				onSubmit={handleSubmit}
				className="flex min-h-[28rem] flex-col justify-center p-6 md:p-8"
			>
				<FieldGroup>
					<div className="flex flex-col items-center gap-2 text-center">
						<Lock className="size-12 text-muted-foreground" />
						<h1 className="font-bold text-xl">Reset Password</h1>
						<p className="text-balance text-muted-foreground">
							Enter your new password below.
						</p>
					</div>

					<Field>
						<Field className="grid grid-cols-2 gap-4">
							<Field data-invalid={!!errors.password || undefined}>
								<FieldLabel htmlFor="password">New Password</FieldLabel>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<FieldError>{errors.password}</FieldError>
							</Field>
							<Field data-invalid={!!errors.confirm || undefined}>
								<FieldLabel htmlFor="confirm-password">
									Confirm Password
								</FieldLabel>
								<Input
									id="confirm-password"
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
								/>
								<FieldError>{errors.confirm}</FieldError>
							</Field>
						</Field>
						<FieldDescription>
							Must be at least 8 characters long.
						</FieldDescription>
					</Field>

					{generalError && (
						<Field>
							<FieldError>{generalError}</FieldError>
						</Field>
					)}

					<Field>
						<Button
							type="submit"
							className="w-full"
							disabled={!password || !confirmPassword || isSubmitting}
						>
							{isSubmitting ? "Resetting..." : "Reset Password"}
						</Button>
					</Field>
					<Field>
						<Button
							type="button"
							variant="ghost"
							className="w-full"
							onClick={() => router.push("/login")}
						>
							Cancel
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</AuthCard>
	);
}

export default function ResetPasswordForm() {
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
			<ResetPasswordFormInner />
		</Suspense>
	);
}
