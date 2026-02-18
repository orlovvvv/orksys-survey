import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Eye, Hammer, Share2 } from "lucide-react";

export type TabValue = "build" | "preview" | "share";

interface TabOption {
	value: TabValue;
	label: string;
	icon: LucideIcon;
}

const tabOptions: TabOption[] = [
	{ value: "build", label: "Build", icon: Hammer },
	{ value: "preview", label: "Preview", icon: Eye },
	{ value: "share", label: "Share", icon: Share2 },
];

interface BuilderTabsProps {
	activeTab: TabValue;
	setActiveTab: (tab: TabValue) => void;
	showShareTab?: boolean;
}

export function BuilderTabs({
	activeTab,
	setActiveTab,
	showShareTab = false,
}: BuilderTabsProps) {
	const visibleTabs = showShareTab
		? tabOptions
		: tabOptions.filter((t) => t.value !== "share");

	return (
		<div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
			{visibleTabs.map((tab) => (
				<TabButton
					key={tab.value}
					tab={tab}
					isActive={activeTab === tab.value}
					onClick={() => setActiveTab(tab.value)}
				/>
			))}
		</div>
	);
}

interface TabButtonProps {
	tab: TabOption;
	isActive: boolean;
	onClick: () => void;
}

function TabButton({ tab, isActive, onClick }: TabButtonProps) {
	const Icon = tab.icon;

	return (
		<button
			type="button"
			onClick={onClick}
			className={`relative flex items-center gap-2 rounded-md px-4 py-1.5 font-sans font-semibold text-xs transition-colors ${
				isActive
					? "text-neutral-900"
					: "text-neutral-500 hover:text-neutral-900"
			}`}
		>
			{isActive && (
				<motion.div
					layoutId="activeTab"
					className="absolute inset-0 rounded-md bg-white shadow-sm"
					transition={{ type: "spring", stiffness: 500, damping: 30 }}
				/>
			)}
			<span className="relative z-10 flex items-center gap-2">
				<Icon className="h-3.5 w-3.5" />
				{tab.label}
			</span>
		</button>
	);
}
