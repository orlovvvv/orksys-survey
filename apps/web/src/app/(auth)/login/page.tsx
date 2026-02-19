"use client";

import { useState } from "react";
import { AuthLegalFooter, SignInForm, SignUpForm } from "@/components/auth";

export default function LoginPage() {
	const [showSignIn, setShowSignIn] = useState(true);

	return (
		<div className="flex flex-col gap-6">
			{showSignIn ? (
				<SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
			) : (
				<SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
			)}
			<AuthLegalFooter />
		</div>
	);
}
