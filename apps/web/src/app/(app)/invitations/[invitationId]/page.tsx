"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle, Building2, Check, Clock, LogIn, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

interface InvitationPageProps {
	params: Promise<{ invitationId: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function roleVariant(role: string): "default" | "secondary" {
	switch (role) {
		case "owner":
			return "default";
		case "admin":
			return "secondary";
		default:
			return "secondary";
	}
}

export default function InvitationPage({ params }: InvitationPageProps) {
	const router = useRouter();

	const sessionQuery = authClient.useSession();
	const [resolvedParams, setResolvedParams] = React.useState<{
		invitationId: string;
	} | null>(null);

	React.useEffect(() => {
		params.then(setResolvedParams);
	}, [params]);

	const invitationId = resolvedParams?.invitationId;

	// Fetch invitation details
	const invitationQuery = useQuery({
		queryKey: ["invitation", invitationId],
		queryFn: async () => {
			if (!invitationId) return null;
			return authClient.organization.getInvitation({
				query: { id: invitationId },
			});
		},
		enabled: !!invitationId,
		retry: false,
	});

	// Accept invitation mutation
	const acceptMutation = useMutation({
		mutationFn: async () => {
			if (!invitationId) throw new Error("No invitation ID");
			const result = await authClient.organization.acceptInvitation({
				invitationId: invitationId,
			});

			if (result.error) {
				throw new Error(result.error.message || "Failed to accept invitation");
			}

			// Set the organization as active
			if (invitationQuery.data?.data?.organizationId) {
				await authClient.organization.setActive({
					organizationId: invitationQuery.data.data.organizationId,
				});
			}

			return result;
		},
		onSuccess: () => {
			toast.success("You've joined the organization!");
			router.push("/dashboard");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to accept invitation");
		},
	});

	// Reject invitation mutation
	const rejectMutation = useMutation({
		mutationFn: async () => {
			if (!invitationId) throw new Error("No invitation ID");
			const result = await authClient.organization.rejectInvitation({
				invitationId: invitationId,
			});

			if (result.error) {
				throw new Error(result.error.message || "Failed to reject invitation");
			}

			return result;
		},
		onSuccess: () => {
			toast.success("Invitation rejected");
			router.push("/");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to reject invitation");
		},
	});

	// Loading state
	if (sessionQuery.isPending || invitationQuery.isPending) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<div className="text-center">
					<Spinner className="mx-auto mb-4 h-8 w-8" />
					<p className="text-muted-foreground text-sm">Loading invitation...</p>
				</div>
			</div>
		);
	}

	// Not authenticated
	if (!sessionQuery.data?.user) {
		const currentPath =
			typeof window !== "undefined"
				? window.location.pathname + window.location.search
				: "";
		return (
			<div className="flex min-h-[50vh] items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<LogIn className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
						<CardTitle>Sign In Required</CardTitle>
						<CardDescription>
							Please sign in to accept this organization invitation
						</CardDescription>
					</CardHeader>
					<CardContent className="flex justify-center">
						<Button
							render={
								<Link
									href={`/login?redirect=${encodeURIComponent(currentPath)}`}
								/>
							}
						>
							Sign In
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Error or not found
	if (invitationQuery.error || !invitationQuery.data?.data) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center p-4">
				<Alert variant="destructive" className="max-w-md">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Invitation Not Found</AlertTitle>
					<AlertDescription>
						This invitation doesn't exist or has been cancelled. Please contact
						the organization administrator for a new invitation.
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	const invitation = invitationQuery.data.data;
	const user = sessionQuery.data.user;

	// Check if invitation is expired
	const isExpired = invitation.expiresAt
		? new Date(invitation.expiresAt) < new Date()
		: false;

	if (isExpired) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center p-4">
				<Alert className="max-w-md">
					<Clock className="h-4 w-4" />
					<AlertTitle>Invitation Expired</AlertTitle>
					<AlertDescription>
						This invitation has expired. Please contact the organization
						administrator for a new invitation.
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	// Check if invitation is for the current user's email
	const isForCurrentUser = invitation.email === user.email;

	if (!isForCurrentUser) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center p-4">
				<Alert className="max-w-md">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Invalid Invitation</AlertTitle>
					<AlertDescription>
						This invitation is for <strong>{invitation.email}</strong> but you
						are signed in as <strong>{user.email}</strong>. Please sign in with
						the correct account.
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	// Valid invitation - show accept/reject UI
	const role = Array.isArray(invitation.role)
		? invitation.role[0]
		: invitation.role;

	return (
		<div className="flex min-h-[50vh] items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<Building2 className="mx-auto mb-4 h-12 w-12 text-primary" />
					<CardTitle>You're Invited!</CardTitle>
					<CardDescription>
						You've been invited to join an organization
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Role badge */}
					<div className="flex justify-center">
						<Badge variant={roleVariant(role)} className="text-sm">
							Role: {role}
						</Badge>
					</div>

					{/* Email verification warning if needed */}
					{!user.emailVerified && (
						<Alert>
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Email Verification Required</AlertTitle>
							<AlertDescription>
								You need to verify your email address before accepting this
								invitation.
							</AlertDescription>
						</Alert>
					)}

					{/* Action buttons */}
					<div className="flex gap-3">
						<Button
							variant="outline"
							className="flex-1"
							disabled={
								rejectMutation.isPending ||
								acceptMutation.isPending ||
								!user.emailVerified
							}
							onClick={() => rejectMutation.mutate()}
						>
							{rejectMutation.isPending ? (
								<Spinner className="mr-2 h-4 w-4" />
							) : (
								<X className="mr-2 h-4 w-4" />
							)}
							Decline
						</Button>
						<Button
							className="flex-1"
							disabled={
								acceptMutation.isPending ||
								rejectMutation.isPending ||
								!user.emailVerified
							}
							onClick={() => acceptMutation.mutate()}
						>
							{acceptMutation.isPending ? (
								<Spinner className="mr-2 h-4 w-4" />
							) : (
								<Check className="mr-2 h-4 w-4" />
							)}
							Accept
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
