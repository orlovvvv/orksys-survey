"use client";

import { Loader2, Shield } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	useRevokeOtherSessions,
	useRevokeSession,
	useSessions,
} from "../../hooks";
import { SessionItem } from "./session-item";

export function SessionList() {
	const { sessions, isLoading } = useSessions();
	const revokeOtherMutation = useRevokeOtherSessions();
	const revokeSessionMutation = useRevokeSession();

	// Get current session ID - we'll need to get this from authClient
	// For now, we'll assume the first session is the current one
	const currentSessionId = React.useMemo(() => {
		// In a real implementation, you'd get this from the current session
		return sessions[0]?.id ?? "";
	}, [sessions]);

	const handleRevokeSession = async (token: string) => {
		await revokeSessionMutation.mutateAsync({ token });
	};

	const handleRevokeAll = async () => {
		await revokeOtherMutation.mutateAsync();
	};

	return (
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
						<p className="text-muted-foreground text-sm">No active sessions</p>
					</div>
				) : (
					<>
						<div className="divide-y">
							{sessions.map((session) => (
								<SessionItem
									key={session.id}
									session={session}
									isCurrent={session.id === currentSessionId}
									isRevoking={revokeSessionMutation.isPending}
									onRevoke={handleRevokeSession}
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
	);
}
