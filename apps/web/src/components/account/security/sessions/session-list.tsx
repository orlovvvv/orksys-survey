"use client";

import { Loader2, Shield } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import {
	useRevokeOtherSessions,
	useRevokeSession,
	useSessions,
} from "../../hooks";
import { detectDevice } from "../utils/session-utils";
import { SessionItem } from "./session-item";
import { SessionRevokeDialog } from "./session-revoke-dialog";

export function SessionList() {
	const { sessions, isLoading } = useSessions();
	const revokeOtherMutation = useRevokeOtherSessions();
	const revokeSessionMutation = useRevokeSession();
	const { data: currentSession } = authClient.useSession();

	// Get the current session token for comparison
	const currentSessionToken = currentSession?.session?.token;

	// Dialog state for revoke confirmation
	const [revokeDialog, setRevokeDialog] = React.useState<{
		open: boolean;
		sessionToken: string;
		deviceName: string;
	}>({
		open: false,
		sessionToken: "",
		deviceName: "",
	});

	// Track which session is being revoked for individual loading state
	const [revokingSessionToken, setRevokingSessionToken] = React.useState<
		string | null
	>(null);

	const handleRevokeClick = (sessionToken: string, userAgent?: string) => {
		const device = detectDevice(userAgent);
		setRevokeDialog({
			open: true,
			sessionToken,
			deviceName: device.name,
		});
	};

	const handleRevokeConfirm = async () => {
		setRevokingSessionToken(revokeDialog.sessionToken);
		try {
			await revokeSessionMutation.mutateAsync({
				token: revokeDialog.sessionToken,
			});
		} finally {
			setRevokingSessionToken(null);
		}
		setRevokeDialog({ ...revokeDialog, open: false });
	};

	const handleRevokeAll = async () => {
		await revokeOtherMutation.mutateAsync();
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5" />
						Active Sessions
					</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex justify-center py-12">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					) : sessions.length === 0 ? (
						<div className="py-8 text-center">
							<p className="text-muted-foreground text-sm">
								No active sessions
							</p>
						</div>
					) : (
						<>
							<div className="divide-y">
								{sessions.map((session) => (
									<SessionItem
										key={session.id}
										session={session}
										isCurrent={session.token === currentSessionToken}
										isRevoking={revokingSessionToken === session.token}
										onRevoke={() =>
											handleRevokeClick(session.token, session.userAgent)
										}
									/>
								))}
							</div>
							{sessions.length > 1 && (
								<div className="mt-4 border-t pt-4">
									<Button
										variant="destructive"
										className="w-full"
										onClick={handleRevokeAll}
										disabled={revokeOtherMutation.isPending}
									>
										{revokeOtherMutation.isPending ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Revoking...
											</>
										) : (
											"Revoke all other sessions"
										)}
									</Button>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			<SessionRevokeDialog
				open={revokeDialog.open}
				onOpenChange={(open) => setRevokeDialog({ ...revokeDialog, open })}
				onConfirm={handleRevokeConfirm}
				deviceName={revokeDialog.deviceName}
				isRevoking={revokingSessionToken === revokeDialog.sessionToken}
			/>
		</>
	);
}
