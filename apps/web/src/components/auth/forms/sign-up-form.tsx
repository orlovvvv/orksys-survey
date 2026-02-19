"use client";

import { useForm } from "@tanstack/react-form";
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

export default function SignUpForm({
	onSwitchToSignIn,
}: {
	onSwitchToSignIn: () => void;
}) {
	const router = useRouter();
	const { isPending } = authClient.useSession();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			name: "",
		},
		onSubmit: async ({ value }) => {
			if (value.password !== value.confirmPassword) {
				toast.error("Passwords do not match");
				return;
			}

			await authClient.signUp.email(
				{
					email: value.email,
					password: value.password,
					name: value.name,
				},
				{
					onSuccess: () => {
						router.push("/onboarding");
						toast.success("Sign up successful");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(2, "Name must be at least 2 characters"),
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
				confirmPassword: z
					.string()
					.min(8, "Password must be at least 8 characters"),
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
						<h1 className="font-bold text-2xl">Create your account</h1>
						<p className="text-balance text-muted-foreground text-sm">
							Enter your details below to create your account
						</p>
					</div>

					<form.Field name="name">
						{(field) => (
							<Field
								data-invalid={!!field.state.meta.errors.length || undefined}
							>
								<FieldLabel htmlFor="name">Name</FieldLabel>
								<Input
									id="name"
									type="text"
									placeholder="Your name"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									required
								/>
								<FieldError errors={field.state.meta.errors} />
							</Field>
						)}
					</form.Field>

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
								<FieldDescription>
									We&apos;ll use this to contact you. We will not share your
									email with anyone else.
								</FieldDescription>
								<FieldError errors={field.state.meta.errors} />
							</Field>
						)}
					</form.Field>

					<Field>
						<Field className="grid grid-cols-2 gap-4">
							<form.Field name="password">
								{(field) => (
									<Field
										data-invalid={!!field.state.meta.errors.length || undefined}
									>
										<FieldLabel htmlFor="password">Password</FieldLabel>
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
							<form.Field name="confirmPassword">
								{(field) => (
									<Field
										data-invalid={!!field.state.meta.errors.length || undefined}
									>
										<FieldLabel htmlFor="confirm-password">
											Confirm Password
										</FieldLabel>
										<Input
											id="confirm-password"
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
						</Field>
						<FieldDescription>
							Must be at least 8 characters long.
						</FieldDescription>
					</Field>

					<Field>
						<form.Subscribe>
							{(state) => (
								<Button
									type="submit"
									className="w-full"
									disabled={!state.canSubmit || state.isSubmitting}
								>
									{state.isSubmitting
										? "Creating account..."
										: "Create Account"}
								</Button>
							)}
						</form.Subscribe>
					</Field>

					<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
						Or continue with
					</FieldSeparator>

					<SocialLoginButtons mode="signup" />

					<FieldDescription className="text-center">
						Already have an account?{" "}
						<button
							type="button"
							onClick={onSwitchToSignIn}
							className="underline underline-offset-4 hover:text-primary"
						>
							Sign in
						</button>
					</FieldDescription>
				</FieldGroup>
			</form>
		</AuthCard>
	);
}
