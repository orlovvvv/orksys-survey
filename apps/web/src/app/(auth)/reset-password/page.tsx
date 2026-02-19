"use client";

import { AuthLegalFooter, ResetPasswordForm } from "@/components/auth";

export default function ResetPasswordPage() {
	return (
		<div className="flex flex-col gap-6">
			<ResetPasswordForm />
			<AuthLegalFooter />
		</div>
	);
}
