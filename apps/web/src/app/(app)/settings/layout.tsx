"use client";

import { Building2, CreditCard, Shield, Trash2, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SettingsSidebar } from "@/components/account/settings-sidebar";
import { cn } from "@/lib/utils";

export default function SettingsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="mx-auto w-full max-w-6xl p-6">
			{/* Desktop: Sidebar layout | Mobile: Tabs layout */}
			<div className="flex flex-col gap-6 lg:flex-row">
				{/* Desktop Sidebar / Mobile Tabs */}
				<div className="lg:sticky lg:top-6 lg:h-fit lg:shrink-0">
					{/* Mobile: Show as horizontal tabs */}
					<div className="lg:hidden">
						<SettingsMobileTabs />
					</div>

					{/* Desktop: Show as vertical sidebar */}
					<div className="hidden lg:block">
						<SettingsSidebar />
					</div>
				</div>

				{/* Content Area */}
				<div className="min-w-0 flex-1">{children}</div>
			</div>
		</div>
	);
}

const mobileTabs = [
	{ value: "profile", label: "Profile", href: "/settings/profile", icon: User },
	{
		value: "security",
		label: "Security",
		href: "/settings/security",
		icon: Shield,
	},
	{
		value: "organization",
		label: "Organization",
		href: "/settings/organization",
		icon: Building2,
	},
	{
		value: "subscription",
		label: "Billing",
		href: "/settings/subscription",
		icon: CreditCard,
	},
	{
		value: "danger",
		label: "Danger",
		href: "/settings/danger",
		icon: Trash2,
	},
];

function SettingsMobileTabs() {
	const pathname = usePathname();

	return (
		<nav className="flex gap-1 overflow-x-auto border-b pb-px">
			{mobileTabs.map((tab) => {
				const Icon = tab.icon;
				const isActive = pathname === tab.href;

				return (
					<Link
						key={tab.value}
						href={tab.href as never}
						className={cn(
							"flex items-center gap-1.5 whitespace-nowrap border-transparent border-b-2 px-3 py-2 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground",
							isActive && "border-foreground text-foreground",
						)}
					>
						<Icon className="h-4 w-4" />
						<span className="hidden sm:inline">{tab.label}</span>
					</Link>
				);
			})}
		</nav>
	);
}
