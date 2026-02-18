"use client";

import * as React from "react";
import {
	AvatarUpload,
	EmailVerificationBanner,
	ProfileForm,
} from "@/components/account/profile";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

export default function ProfileSettingsPage() {
	const sessionQuery = authClient.useSession();
	const [_pendingImage, setPendingImage] = React.useState<string | null>(null);

	const user = sessionQuery.data?.user;
	const email = user?.email ?? "";
	const name = user?.name ?? "";
	const image = user?.image ?? undefined;
	const emailVerified = user?.emailVerified ?? null;

	if (sessionQuery.isPending) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<div className="text-center">
					<Spinner className="mx-auto mb-4 h-8 w-8" />
					<p className="text-muted-foreground text-sm">Loading profile...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-2xl p-6">
			{/* Page Header */}
			<div className="mb-8">
				<h1 className="font-bold text-2xl text-foreground">Profile Settings</h1>
				<p className="text-muted-foreground">
					Manage your account information and preferences
				</p>
			</div>

			{/* Email Verification Banner */}
			<div className="mb-6">
				<EmailVerificationBanner email={email} emailVerified={emailVerified} />
			</div>

			{/* Profile Content */}
			<div className="space-y-8">
				{/* Avatar Section */}
				<div className="flex items-start gap-6">
					<div className="flex shrink-0 flex-col items-center gap-2">
						<AvatarUpload
							name={name}
							image={image}
							onImageChange={setPendingImage}
							className="h-24 w-24"
						/>
						<span className="text-muted-foreground text-xs">
							Click to change avatar
						</span>
					</div>
					<div className="flex-1">
						<ProfileForm
							initialName={name}
							email={email}
							onSuccess={() => {
								setPendingImage(null);
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
