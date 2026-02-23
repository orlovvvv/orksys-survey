"use client";

import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	detectDevice,
	formatIpAddress,
	formatSessionTime,
} from "../utils/session-utils";

interface SessionItemProps {
	session: {
		id: string;
		token: string;
		expiresAt: Date;
		ipAddress?: string;
		userAgent?: string;
	};
	isCurrent: boolean;
	isRevoking: boolean;
	onRevoke: () => void;
}

export function SessionItem({
	session,
	isCurrent,
	isRevoking = false,
	onRevoke,
}: SessionItemProps) {
	const device = detectDevice(session.userAgent);
	const ip = formatIpAddress(session.ipAddress);
	const expiresText = formatSessionTime(session.expiresAt);

	return (
		<div className="border-b py-4 last:border-b-0">
			<div className="flex items-start justify-between">
				<div className="flex items-start gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
						{device.icon}
					</div>
					<div className="min-w-0 flex-1">
						<div className="mb-1 flex items-center gap-2">
							<span className="font-medium text-sm">{device.name}</span>
							{isCurrent && (
								<Badge variant="secondary" className="text-xs">
									Current
								</Badge>
							)}
						</div>
						{ip && <div className="text-muted-foreground text-xs">{ip}</div>}
						<div className="mt-1 text-muted-foreground text-xs">
							{expiresText}
						</div>
					</div>
				</div>
				{!isCurrent && (
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={onRevoke}
						disabled={isRevoking}
						className="text-muted-foreground hover:text-destructive"
					>
						{isRevoking ? (
							<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
						) : (
							<Trash2 className="h-4 w-4" />
						)}
					</Button>
				)}
			</div>
		</div>
	);
}
