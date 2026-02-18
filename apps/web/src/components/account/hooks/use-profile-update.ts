"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

interface UpdateProfileData {
	name?: string;
	image?: string;
}

/**
 * Mutation to update user profile (name and/or avatar).
 */
export function useProfileUpdate() {
	return useMutation({
		mutationFn: async ({ name, image }: UpdateProfileData) => {
			const updateData: Record<string, string> = {};
			if (name !== undefined) updateData.name = name;
			if (image !== undefined) updateData.image = image;

			await authClient.updateUser(updateData);
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update profile");
		},
	});
}

/**
 * Mutation to send email verification email.
 */
export function useSendVerificationEmail() {
	return useMutation({
		mutationFn: async ({ email }: { email: string }) => {
			await authClient.sendVerificationEmail({
				email,
			});
		},
		onSuccess: () => {
			toast.success("Verification email sent. Please check your inbox.");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to send verification email");
		},
	});
}
