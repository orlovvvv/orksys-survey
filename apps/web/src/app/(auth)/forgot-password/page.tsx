"use client";

import { AuthLegalFooter, ForgotPasswordForm } from "@/components/auth";

export default function ForgotPasswordPage() {
	return (
		<div className="flex flex-col gap-6">
			<ForgotPasswordForm />
			<AuthLegalFooter />
		</div>
	);
}
