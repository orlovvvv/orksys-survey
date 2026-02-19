"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { AuthCard } from "@/components/auth/auth-card";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function SignInForm({
	onSwitchToSignUp,
}: {
	onSwitchToSignUp: () => void;
}) {
	const router = useRouter();
	const { isPending } = authClient.useSession();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
				},
				{
					onSuccess: () => {
						router.push("/dashboard");
						toast.success("Sign in successful");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	if (isPending) {
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
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="flex min-h-[28rem] flex-col justify-center p-6 md:p-8"
			>
				<FieldGroup>
					<div className="flex flex-col items-center gap-2 text-center">
						<h1 className="font-bold text-2xl">Welcome back</h1>
						<p className="text-balance text-muted-foreground">
							Login to your Handshake account
						</p>
					</div>

					<form.Field name="email">
						{(field) => (
							<Field
								data-invalid={!!field.state.meta.errors.length || undefined}
							>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									required
								/>
								<FieldError errors={field.state.meta.errors} />
							</Field>
						)}
					</form.Field>

					<form.Field name="password">
						{(field) => (
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<Link
										href="/forgot-password"
										className="ml-auto text-sm underline-offset-2 hover:underline"
									>
										Forgot your password?
									</Link>
								</div>
								<Input
									id="password"
									type="password"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									required
								/>
								<FieldError errors={field.state.meta.errors} />
							</Field>
						)}
					</form.Field>

					<Field>
						<form.Subscribe>
							{(state) => (
								<Button
									type="submit"
									className="w-full"
									disabled={!state.canSubmit || state.isSubmitting}
								>
									{state.isSubmitting ? "Signing in..." : "Login"}
								</Button>
							)}
						</form.Subscribe>
					</Field>

					<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
						Or continue with
					</FieldSeparator>

					<SocialLoginButtons mode="signin" />

					<FieldDescription className="text-center">
						Don&apos;t have an account?{" "}
						<button
							type="button"
							onClick={onSwitchToSignUp}
							className="underline underline-offset-4 hover:text-primary"
						>
							Sign up
						</button>
					</FieldDescription>
				</FieldGroup>
			</form>
		</AuthCard>
	);
}
