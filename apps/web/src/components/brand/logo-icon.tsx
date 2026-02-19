import { Handshake } from "lucide-react";
import { cn } from "@/lib/utils";

const iconSizeMap = {
	sm: "size-4",
	md: "size-5",
	lg: "size-6",
} as const;

const containerSizeMap = {
	sm: "size-6",
	md: "size-8",
	lg: "size-10",
} as const;

interface LogoIconProps {
	size?: "sm" | "md" | "lg";
	className?: string;
}

/**
 * Standalone icon-only logo for loading states, favicons, and tight spaces.
 * Use the main Logo component with variant="icon-only" when you need a Link.
 */
export function LogoIcon({ size = "md", className }: LogoIconProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-lg bg-primary text-primary-foreground",
				containerSizeMap[size],
				className,
			)}
		>
			<Handshake className={cn(iconSizeMap[size])} />
		</div>
	);
}
