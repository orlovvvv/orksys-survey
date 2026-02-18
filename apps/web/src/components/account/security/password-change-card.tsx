"use client";

import { Loader2, Lock } from "lucide-react";
import * as React from "react";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { usePasswordChange } from "../hooks";

export function PasswordChangeCard() {
	const mutation = usePasswordChange();
	const [currentPassword, setCurrentPassword] = React.useState("");
	const [newPassword, setNewPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [revokeOtherSessions, setRevokeOtherSessions] = React.useState(true);

	const [errors, setErrors] = React.useState<{
		currentPassword?: string;
		newPassword?: string;
		confirmPassword?: string;
	}>({});

	const validateForm = () => {
		const newErrors: typeof errors = {};

		if (!currentPassword) {
			newErrors.currentPassword = "Current password is required";
		}

		if (!newPassword) {
			newErrors.newPassword = "New password is required";
		} else if (newPassword.length < 8) {
			newErrors.newPassword = "Password must be at least 8 characters";
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (newPassword !== confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		await mutation.mutateAsync({
			currentPassword,
			newPassword,
			revokeOtherSessions,
		});

		// Reset form on success
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
		setErrors({});
	};

	return (
		<form onSubmit={handleSubmit}>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Lock className="h-5 w-5" />
						Change Password
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<FormField
						label="Current Password"
						type="password"
						value={currentPassword}
						onChange={setCurrentPassword}
						error={errors.currentPassword}
						placeholder="Enter your current password"
						required
					/>

					<FormField
						label="New Password"
						type="password"
						value={newPassword}
						onChange={setNewPassword}
						error={errors.newPassword}
						placeholder="Enter your new password"
						hint="Must be at least 8 characters"
						required
					/>

					<FormField
						label="Confirm New Password"
						type="password"
						value={confirmPassword}
						onChange={setConfirmPassword}
						error={errors.confirmPassword}
						placeholder="Confirm your new password"
						required
					/>

					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium text-sm">Sign out of other devices</p>
							<p className="text-muted-foreground text-xs">
								Signing out will end all other sessions
							</p>
						</div>
						<Switch
							checked={revokeOtherSessions}
							onCheckedChange={setRevokeOtherSessions}
							size="default"
						/>
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Changing Password...
							</>
						) : (
							"Change Password"
						)}
					</Button>
				</CardContent>
			</Card>
		</form>
	);
}
