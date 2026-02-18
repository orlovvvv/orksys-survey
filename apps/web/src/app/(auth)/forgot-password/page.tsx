"use client";

import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

export default function ForgotPasswordPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// Validate email
		const emailSchema = z.string().email("Invalid email address");
		const validationResult = emailSchema.safeParse(email);

		if (!validationResult.success) {
			setError(validationResult.error.issues[0].message);
			return;
		}

		setIsSubmitting(true);

		const redirectTo = `${window.location.origin}/reset-password`;

		await authClient.requestPasswordReset(
			{ email, redirectTo },
			{
				onSuccess: () => {
					setIsSuccess(true);
					toast.success("Check your email for the reset link");
				},
				onError: (ctx: { error: { message?: string } }) => {
					setError(
						ctx.error.message ||
							"Failed to send reset email. Please try again.",
					);
					toast.error(ctx.error.message || "Failed to send reset email");
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

	if (isSuccess) {
		return (
			<Card>
				<CardHeader className="text-center">
					<div className="flex justify-center">
						<Mail className="size-12 text-primary" />
					</div>
					<CardTitle className="mt-4">Check Your Email</CardTitle>
					<CardDescription>
						We've sent a password reset link to <strong>{email}</strong>. The
						link will expire in 24 hours.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Button
						variant="outline"
						className="w-full"
						onClick={() => router.push("/login")}
					>
						Back to Sign In
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl">Forgot Password</CardTitle>
				<CardDescription>
					Enter your email address and we'll send you a link to reset your
					password.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<FormField
						label="Email"
						type="email"
						placeholder="you@example.com"
						value={email}
						onChange={setEmail}
						error={error}
						required
					/>
					<Button
						type="submit"
						className="w-full"
						disabled={!email || isSubmitting}
					>
						{isSubmitting ? "Sending..." : "Send Reset Link"}
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
