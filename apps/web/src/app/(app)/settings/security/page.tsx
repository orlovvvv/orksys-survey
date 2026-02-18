"use client";

import { Shield } from "lucide-react";

import { PasswordChangeCard, SessionList } from "@/components/account/security";

export default function SecuritySettingsPage() {
	return (
		<div className="mx-auto w-full max-w-4xl p-6">
			{/* Page Header */}
			<div className="mb-8">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
						<Shield className="h-5 w-5 text-primary" />
					</div>
					<div>
						<h1 className="font-bold text-2xl text-foreground">
							Security Settings
						</h1>
						<p className="text-muted-foreground">
							Manage your password and active sessions
						</p>
					</div>
				</div>
			</div>

			{/* Security Cards */}
			<div className="grid gap-6 md:grid-cols-2">
				<div className="md:col-span-2">
					<PasswordChangeCard />
				</div>
				<div className="md:col-span-2">
					<SessionList />
				</div>
			</div>
		</div>
	);
}
