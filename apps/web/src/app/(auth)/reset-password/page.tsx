"use client";

import { Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { FormField } from "@/components/forms/form-field";
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

function ResetPasswordForm() {
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
			<Card>
				<CardContent className="flex items-center justify-center py-12">
					<Loader />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex justify-center">
					<Lock className="size-12 text-muted-foreground" />
				</div>
				<CardTitle className="mt-4 text-center text-2xl">
					Reset Password
				</CardTitle>
				<CardDescription className="text-center">
					Enter your new password below.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<FormField
						label="New Password"
						type="password"
						placeholder="••••••••"
						value={password}
						onChange={setPassword}
						error={errors.password}
						required
					/>
					<FormField
						label="Confirm Password"
						type="password"
						placeholder="••••••••"
						value={confirmPassword}
						onChange={setConfirmPassword}
						error={errors.confirm}
						required
					/>
					{generalError && (
						<p className="text-destructive text-sm">{generalError}</p>
					)}
					<Button
						type="submit"
						className="w-full"
						disabled={!password || !confirmPassword || isSubmitting}
					>
						{isSubmitting ? "Resetting..." : "Reset Password"}
					</Button>
					<Button
						type="button"
						variant="ghost"
						className="w-full"
						onClick={() => router.push("/login")}
					>
						Cancel
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

export default function ResetPasswordPage() {
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
			<ResetPasswordForm />
		</Suspense>
	);
}
