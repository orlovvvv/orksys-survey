"use client";

import { CreditCard, Shield, Trash2, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SettingsNavItem {
	href: string;
	label: string;
	icon: typeof User;
}

const settingsNavItems: SettingsNavItem[] = [
	{
		href: "/settings/profile",
		label: "Profile",
		icon: User,
	},
	{
		href: "/settings/security",
		label: "Security",
		icon: Shield,
	},
	{
		href: "/settings/subscription",
		label: "Subscription",
		icon: CreditCard,
	},
	{
		href: "/settings/danger",
		label: "Danger Zone",
		icon: Trash2,
	},
];

interface SettingsSidebarProps {
	className?: string;
}

export function SettingsSidebar({ className }: SettingsSidebarProps) {
	const pathname = usePathname();

	return (
		<nav
			className={cn(
				"flex w-full flex-col gap-1 lg:w-60 lg:shrink-0",
				className,
			)}
		>
			{settingsNavItems.map((item) => {
				const Icon = item.icon;
				const isActive = pathname === item.href;

				return (
					<Link key={item.href} href={item.href as never}>
						<Button
							variant={isActive ? "secondary" : "ghost"}
							className={cn(
								"w-full justify-start gap-2",
								isActive && "bg-secondary",
							)}
						>
							<Icon className="h-4 w-4" />
							<span>{item.label}</span>
						</Button>
					</Link>
				);
			})}
		</nav>
	);
}
