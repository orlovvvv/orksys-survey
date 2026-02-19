"use client";

import { Card, CardContent } from "@/components/ui/card";

interface AuthCardProps {
	children: React.ReactNode;
	imageSrc?: string;
	imageAlt?: string;
}

export function AuthCard({
	children,
	imageSrc = "/auth-sidebar.jpg",
	imageAlt = "Authentication sidebar image",
}: AuthCardProps) {
	return (
		<Card className="overflow-hidden p-0">
			<CardContent className="grid p-0 md:grid-cols-2">
				<div className="p-6 md:p-8">{children}</div>
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
