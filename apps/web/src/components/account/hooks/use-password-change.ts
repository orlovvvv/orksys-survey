"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

interface ChangePasswordParams {
	currentPassword: string;
	newPassword: string;
	revokeOtherSessions?: boolean;
}

/**
 * Mutation to change the user's password.
 */
export function usePasswordChange() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			currentPassword,
			newPassword,
			revokeOtherSessions = false,
		}: ChangePasswordParams) => {
			await authClient.changePassword({
				currentPassword,
				newPassword,
				revokeOtherSessions,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["account", "sessions"],
			});
			toast.success("Password changed successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to change password");
		},
	});
}
