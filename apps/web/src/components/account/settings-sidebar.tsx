"use client";

import { Building2, CreditCard, Shield, Trash2, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export interface SettingsNavItem {
	href: string;
	label: string;
	icon: typeof User;
	variant?: "default" | "danger";
}

interface SettingsNavGroup {
	label: string;
	items: SettingsNavItem[];
}

const settingsNavGroups: SettingsNavGroup[] = [
	{
		label: "Personal",
		items: [
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
		],
	},
	{
		label: "Organization",
		items: [
			{
				href: "/settings/organization",
				label: "Members",
				icon: Building2,
			},
		],
	},
	{
		label: "Billing",
		items: [
			{
				href: "/settings/subscription",
				label: "Subscription",
				icon: CreditCard,
			},
		],
	},
	{
		label: "Danger Zone",
		items: [
			{
				href: "/settings/danger",
				label: "Delete Account",
				icon: Trash2,
				variant: "danger",
			},
		],
	},
];

interface SettingsSidebarProps {
	className?: string;
}

export function SettingsSidebar({ className }: SettingsSidebarProps) {
	const pathname = usePathname();

	return (
		<nav className={cn("flex w-full flex-col gap-1 lg:w-60", className)}>
			{settingsNavGroups.map((group, groupIndex) => (
				<div key={group.label}>
					<div className="mb-2 px-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">
						{group.label}
					</div>
					{group.items.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;
						const isDanger = item.variant === "danger";

						return (
							<Link
								key={item.href}
								href={item.href as never}
								className={cn(
									"flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
									"hover:bg-accent hover:text-accent-foreground",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
									isActive && "bg-accent font-medium text-accent-foreground",
									isDanger &&
										"text-destructive hover:bg-destructive/10 hover:text-destructive",
									isDanger && isActive && "bg-destructive/10 text-destructive",
								)}
							>
								<Icon className="h-4 w-4" />
								<span>{item.label}</span>
							</Link>
						);
					})}
					{groupIndex < settingsNavGroups.length - 1 && (
						<div className="my-3 h-px bg-border" />
					)}
				</div>
			))}
		</nav>
	);
}
