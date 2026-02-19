"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2, Lock } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { usePasswordChange } from "../hooks";

const passwordFormSchema = z
	.object({
		currentPassword: z.string().min(1, "Required"),
		newPassword: z.string().min(8, "Must be at least 8 characters"),
		confirmPassword: z.string(),
		revokeOtherSessions: z.boolean(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match",
	});

export function PasswordChangeDialog() {
	const [open, setOpen] = React.useState(false);
	const mutation = usePasswordChange();

	const form = useForm({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
			revokeOtherSessions: true,
		},
		validators: {
			onSubmit: passwordFormSchema,
		},
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync({
				currentPassword: value.currentPassword,
				newPassword: value.newPassword,
				revokeOtherSessions: value.revokeOtherSessions,
			});
			form.reset();
			setOpen(false);
			toast.success("Password changed successfully");
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Lock className="h-5 w-5" />
						Password
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm">
						Change your password to keep your account secure.
					</p>
					<DialogTrigger
						render={
							<Button className="mt-4 w-full" variant="outline">
								Change Password
							</Button>
						}
					/>
				</CardContent>
			</Card>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Change Password</DialogTitle>
					<DialogDescription>
						Enter your current password and choose a new one.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="flex flex-col gap-4"
				>
					<form.Field name="currentPassword">
						{(field) => (
							<Field data-invalid={!!field.state.meta.errors.length}>
								<FieldLabel>Current Password</FieldLabel>
								<Input
									type="password"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									placeholder="Enter your current password"
									required
								/>
								<FieldError errors={field.state.meta.errors} />
							</Field>
						)}
					</form.Field>

					<form.Field name="newPassword">
						{(field) => (
							<Field data-invalid={!!field.state.meta.errors.length}>
								<FieldLabel>New Password</FieldLabel>
								<Input
									type="password"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									placeholder="Enter your new password"
									required
								/>
								<FieldError errors={field.state.meta.errors} />
								<FieldDescription>
									Must be at least 8 characters
								</FieldDescription>
							</Field>
						)}
					</form.Field>

					<form.Field name="confirmPassword">
						{(field) => (
							<Field data-invalid={!!field.state.meta.errors.length}>
								<FieldLabel>Confirm New Password</FieldLabel>
								<Input
									type="password"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									placeholder="Confirm your new password"
									required
								/>
								<FieldError errors={field.state.meta.errors} />
							</Field>
						)}
					</form.Field>

					<form.Field name="revokeOtherSessions">
						{(field) => (
							<Field>
								<div className="flex items-center justify-between rounded-lg border p-3">
									<div>
										<p className="font-medium text-sm">
											Sign out of other devices
										</p>
										<p className="text-muted-foreground text-xs">
											Signing out will end all other sessions
										</p>
									</div>
									<Switch
										checked={field.state.value}
										onCheckedChange={(checked) => field.handleChange(checked)}
										size="default"
									/>
								</div>
							</Field>
						)}
					</form.Field>

					<DialogFooter>
						<Button
							type="button"
							variant="secondary"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<form.Subscribe>
							{(state) => (
								<Button
									type="submit"
									disabled={!state.canSubmit || state.isSubmitting}
								>
									{state.isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Changing...
										</>
									) : (
										"Change Password"
									)}
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
