"use client";

import { Shield } from "lucide-react";

import {
	PasswordChangeDialog,
	SessionList,
} from "@/components/account/security";

export default function SecuritySettingsPage() {
	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
						<Shield className="h-5 w-5 text-primary" />
					</div>
					<div>
						<h1 className="font-bold text-2xl text-foreground">
							Security Settings
						</h1>
						<p className="text-muted-foreground text-sm">
							Manage your password and active sessions
						</p>
					</div>
				</div>
			</div>

			{/* Security Cards */}
			<div className="grid gap-6">
				<PasswordChangeDialog />
				<SessionList />
			</div>
		</div>
	);
}
