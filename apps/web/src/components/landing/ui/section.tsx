import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionSize = "narrow" | "default" | "wide";
type SectionBackground = "transparent" | "muted" | "white" | "dark";

interface SectionProps<T extends ElementType = "section"> {
	as?: T;
	size?: SectionSize;
	background?: SectionBackground;
	className?: string;
	children: ReactNode;
}

const sizeClasses: Record<SectionSize, string> = {
	narrow: "max-w-5xl",
	default: "max-w-7xl",
	wide: "max-w-full",
};

const backgroundClasses: Record<SectionBackground, string> = {
	transparent: "",
	muted: "bg-neutral-50",
	white: "bg-white",
	dark: "bg-neutral-950",
};

export function Section<T extends ElementType = "section">({
	as,
	size = "default",
	background = "transparent",
	className,
	children,
	...props
}: SectionProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof SectionProps<T>>) {
	const Component = as || "section";

	return (
		<Component
			className={cn(
				"px-6 py-24 md:px-12 lg:px-24",
				backgroundClasses[background],
				className,
			)}
			{...props}
		>
			<div className={cn("mx-auto", sizeClasses[size])}>{children}</div>
		</Component>
	);
}
