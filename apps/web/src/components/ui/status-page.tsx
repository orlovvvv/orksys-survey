"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const statusPageVariants = cva(
	"flex min-h-svh flex-col items-center justify-center p-4",
	{
		variants: {
			variant: {
				default: "bg-background",
				embed: "bg-transparent",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

interface StatusPageProps extends VariantProps<typeof statusPageVariants> {
	children: ReactNode;
	className?: string;
}

export function StatusPage({ variant, children, className }: StatusPageProps) {
	return (
		<div className={cn(statusPageVariants({ variant }), className)}>
			<div className="w-full max-w-md text-center">{children}</div>
		</div>
	);
}

const iconVariants = cva(
	"mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full",
	{
		variants: {
			status: {
				loading: "bg-transparent",
				error: "bg-destructive/10",
				success: "bg-success/10",
			},
		},
		defaultVariants: { status: "loading" },
	},
);

interface StatusPageIconProps extends VariantProps<typeof iconVariants> {
	children?: ReactNode;
	className?: string;
}

export function StatusPageIcon({
	status,
	children,
	className,
}: StatusPageIconProps) {
	return (
		<div className={cn(iconVariants({ status }), className)}>
			{status === "loading" ? (
				<Loader2 className="size-8 animate-spin text-muted-foreground" />
			) : (
				children
			)}
		</div>
	);
}

export function StatusPageTitle({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<h1 className={cn("font-semibold text-2xl text-foreground", className)}>
			{children}
		</h1>
	);
}

export function StatusPageDescription({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<p className={cn("mt-3 text-muted-foreground", className)}>{children}</p>
	);
}
