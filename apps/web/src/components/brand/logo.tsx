import { cva, type VariantProps } from "class-variance-authority";
import { Handshake } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";

const logoVariants = cva(
	"flex items-center gap-2 font-medium transition-colors",
	{
		variants: {
			variant: {
				full: "",
				compact: "gap-1.5",
				"icon-only": "",
			},
			size: {
				sm: "",
				md: "",
				lg: "",
			},
		},
		defaultVariants: { variant: "full", size: "md" },
	},
);

const iconSizeMap = {
	sm: "size-4",
	md: "size-4",
	lg: "size-5",
} as const;

const iconContainerSizeMap = {
	sm: "size-6",
	md: "size-6",
	lg: "size-7",
} as const;

const textSizeMap = {
	sm: "text-sm",
	md: "text-base",
	lg: "text-lg",
} as const;

const bylineSizeMap = {
	sm: "text-[8px]",
	md: "text-[9px]",
	lg: "text-[10px]",
} as const;

interface LogoProps extends VariantProps<typeof logoVariants> {
	href?: Route<string>;
	showByline?: boolean;
	className?: string;
}

export function Logo({
	variant,
	size,
	href = "/",
	showByline,
	className,
}: LogoProps) {
	return (
		<Link
			href={href}
			className={cn(logoVariants({ variant, size }), className)}
		>
			<BrandIcon size={size ?? "md"} />
			{variant !== "icon-only" && (
				<BrandText size={size ?? "md"} showByline={showByline} />
			)}
		</Link>
	);
}

interface LogoIconProps {
	size?: "sm" | "md" | "lg";
	className?: string;
}

export function BrandIcon({ size = "md", className }: LogoIconProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-md bg-primary text-primary-foreground",
				iconContainerSizeMap[size],
				className,
			)}
		>
			<Handshake className={iconSizeMap[size]} />
		</div>
	);
}

interface BrandTextProps {
	size?: "sm" | "md" | "lg";
	showByline?: boolean;
	className?: string;
}

export function BrandText({
	size = "md",
	showByline,
	className,
}: BrandTextProps) {
	return (
		<div className={cn("flex flex-col", className)}>
			<span
				className={cn("font-bold uppercase tracking-tight", textSizeMap[size])}
			>
				Handshake
			</span>
			{showByline && (
				<span
					className={cn(
						"font-bold text-muted-foreground tracking-widest",
						bylineSizeMap[size],
					)}
				>
					BY ORKSYSTEMS
				</span>
			)}
		</div>
	);
}
