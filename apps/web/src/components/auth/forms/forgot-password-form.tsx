"use client";

import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { AuthCard } from "@/components/auth/auth-card";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordForm() {
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
			<AuthCard>
				<div className="flex min-h-[28rem] items-center justify-center p-6 md:p-8">
					<Loader />
				</div>
			</AuthCard>
		);
	}

	if (isSuccess) {
		return (
			<AuthCard>
				<form className="flex min-h-[28rem] flex-col justify-center p-6 md:p-8">
					<FieldGroup>
						<div className="flex flex-col items-center gap-2 text-center">
							<Mail className="size-12 text-primary" />
							<h1 className="font-semibold text-xl">Check Your Email</h1>
							<p className="text-balance text-muted-foreground text-sm">
								We&apos;ve sent a password reset link to{" "}
								<strong>{email}</strong>. The link will expire in 24 hours.
							</p>
						</div>
						<Field>
							<Button
								variant="outline"
								className="w-full"
								onClick={() => router.push("/login")}
							>
								Back to Sign In
							</Button>
						</Field>
					</FieldGroup>
				</form>
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
						<h1 className="font-bold text-xl">Forgot Password</h1>
						<p className="text-balance text-muted-foreground">
							Enter your email address and we&apos;ll send you a link to reset
							your password.
						</p>
					</div>
					<Field data-invalid={!!error || undefined}>
						<FieldLabel htmlFor="email">Email</FieldLabel>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<FieldError>{error}</FieldError>
					</Field>
					<Field>
						<Button
							type="submit"
							className="w-full"
							disabled={!email || isSubmitting}
						>
							{isSubmitting ? "Sending..." : "Send Reset Link"}
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
