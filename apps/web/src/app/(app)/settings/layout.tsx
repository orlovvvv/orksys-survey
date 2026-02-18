import { SettingsSidebar } from "@/components/account/settings-sidebar";

export default function SettingsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="mx-auto w-full max-w-6xl p-6">
			{/* Page Header */}
			<div className="mb-8">
				<h1 className="font-bold text-2xl text-foreground">Account Settings</h1>
				<p className="text-muted-foreground">
					Manage your account settings and preferences
				</p>
			</div>

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
				<div className="flex-1">{children}</div>
			</div>
		</div>
	);
}

function SettingsMobileTabs() {
	const tabs = [
		{ value: "profile", label: "Profile", href: "/settings/profile" },
		{ value: "security", label: "Security", href: "/settings/security" },
		{
			value: "subscription",
			label: "Subscription",
			href: "/settings/subscription",
		},
		{
			value: "danger",
			label: "Danger Zone",
			href: "/settings/danger",
		},
	];

	return (
		<nav className="flex gap-4 overflow-x-auto border-b pb-px">
			{tabs.map((tab) => (
				<a
					key={tab.value}
					href={tab.href}
					className="border-transparent border-b-2 py-2 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground data-[active=true]:border-foreground data-[active=true]:text-foreground"
				>
					{tab.label}
				</a>
			))}
		</nav>
	);
}
