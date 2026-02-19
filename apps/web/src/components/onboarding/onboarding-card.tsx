"use client";

import { Card, CardContent } from "@/components/ui/card";

interface OnboardingCardProps {
	children: React.ReactNode;
	imageSrc?: string;
	imageAlt?: string;
}

export function OnboardingCard({
	children,
	imageSrc = "/auth-sidebar.jpg",
	imageAlt = "Onboarding sidebar image",
}: OnboardingCardProps) {
	return (
		<Card className="overflow-hidden p-0">
			<CardContent className="grid p-0 md:grid-cols-2">
				<div className="flex min-h-[28rem] flex-col justify-center p-6 md:p-8">
					{children}
				</div>
				<div className="relative hidden bg-muted md:block">
					<img
						src={imageSrc}
						alt={imageAlt}
						className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
					/>
				</div>
			</CardContent>
		</Card>
	);
}
