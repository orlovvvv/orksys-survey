"use client";

import { User } from "lucide-react";
import * as React from "react";

import {
	AvatarUpload,
	EmailVerificationBanner,
	ProfileForm,
} from "@/components/account/profile";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldGroup,
	FieldSeparator,
	FieldTitle,
} from "@/components/ui/field";
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
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
						<User className="h-5 w-5 text-primary" />
					</div>
					<div>
						<h1 className="font-bold text-2xl text-foreground">
							Profile Settings
						</h1>
						<p className="text-muted-foreground text-sm">
							Manage your account information and preferences
						</p>
					</div>
				</div>
			</div>

			{/* Email Verification Banner */}
			<EmailVerificationBanner email={email} emailVerified={emailVerified} />

			{/* Profile Information Card */}
			<Card>
				<CardHeader>
					<CardTitle>Profile Information</CardTitle>
					<CardDescription>
						Update your account profile information
					</CardDescription>
				</CardHeader>
				<CardContent>
					<FieldGroup>
						{/* Avatar Field */}
						<Field orientation="horizontal">
							<FieldContent>
								<FieldTitle>Avatar</FieldTitle>
								<FieldDescription>
									Click on the avatar to upload a new image
								</FieldDescription>
							</FieldContent>
							<AvatarUpload
								name={name}
								image={image}
								onImageChange={setPendingImage}
								className="h-16 w-16"
							/>
						</Field>

						<FieldSeparator />

						{/* Name Field */}
						<Field orientation="horizontal">
							<FieldContent>
								<FieldTitle>Name</FieldTitle>
								<FieldDescription>Your display name</FieldDescription>
							</FieldContent>
							<div className="w-full max-w-sm">
								<ProfileForm
									initialName={name}
									email={email}
									onSuccess={() => {
										setPendingImage(null);
									}}
								/>
							</div>
						</Field>

						<FieldSeparator />

						{/* Email Field */}
						<Field orientation="horizontal">
							<FieldContent>
								<FieldTitle>Email</FieldTitle>
								<FieldDescription>
									Primary email for notifications and account recovery
								</FieldDescription>
							</FieldContent>
							<div className="flex items-center gap-2">
								<span className="text-sm">{email}</span>
								{emailVerified ? (
									<Badge variant="secondary" className="text-xs">
										Verified
									</Badge>
								) : (
									<Badge variant="outline" className="text-xs">
										Unverified
									</Badge>
								)}
							</div>
						</Field>
					</FieldGroup>
				</CardContent>
			</Card>
		</div>
	);
}
