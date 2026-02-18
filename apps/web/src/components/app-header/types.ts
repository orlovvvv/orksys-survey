import type { ReactNode } from "react";

export interface NavItem {
	href: string;
	label: string;
	icon?: ReactNode;
	badge?: string | number;
	disabled?: boolean;
}

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

export interface AppHeaderContextValue {
	navItems: NavItem[];
	currentPath: string;
	mobileMenuOpen: boolean;
	setMobileMenuOpen: (open: boolean) => void;
}

export interface AppHeaderProps {
	children?: ReactNode;
	className?: string;
	navItems?: NavItem[];
	showOrgSwitcher?: boolean;
	showThemeToggle?: boolean;
	showUserMenu?: boolean;
	breadcrumbs?: BreadcrumbItem[];
	sticky?: boolean;
	border?: "none" | "bottom" | "full";
}
