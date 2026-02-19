"use client";

import { FieldDescription } from "@/components/ui/field";

export function AuthLegalFooter() {
	return (
		<FieldDescription className="px-6 text-center">
			By clicking continue, you agree to our{" "}
			<a
				href="/terms"
				className="underline underline-offset-4 hover:text-primary"
			>
				Terms of Service
			</a>{" "}
			and{" "}
			<a
				href="/privacy"
				className="underline underline-offset-4 hover:text-primary"
			>
				Privacy Policy
			</a>
			.
		</FieldDescription>
	);
}
