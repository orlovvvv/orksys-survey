"use client";

import { DeleteAccountDialog } from "@/components/account/danger";

export default function DangerSettingsPage() {
	return (
		<div className="mx-auto w-full max-w-4xl p-6">
			{/* Page Header */}
			<div className="mb-8">
				<div>
					<h1 className="font-bold text-2xl text-foreground">Danger Zone</h1>
					<p className="text-muted-foreground">
						Irreversible and destructive actions for your account
					</p>
				</div>
			</div>

			{/* Danger Zone */}
			<div className="space-y-6">
				<DeleteAccountDialog />
			</div>
		</div>
	);
}
