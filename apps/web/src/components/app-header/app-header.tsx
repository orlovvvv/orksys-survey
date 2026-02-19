"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { Logo } from "@/components/brand";
import { ModeToggle } from "@/components/mode-toggle";
import OrganizationSwitcher from "@/components/organization-switcher";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import UserMenu from "@/components/user-menu";
import { cn } from "@/lib/utils";

import type { NavItem } from "./types";

interface AppHeaderProps {
	navItems?: NavItem[];
	showOrgSwitcher?: boolean;
	showThemeToggle?: boolean;
	showUserMenu?: boolean;
}

export function AppHeader({
	navItems = defaultNavItems,
	showOrgSwitcher = true,
	showThemeToggle = true,
	showUserMenu = true,
}: AppHeaderProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
	const pathname = usePathname();

	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full border-b backdrop-blur-lg",
				"bg-background/95 supports-[backdrop-filter]:bg-background/80",
			)}
		>
			<nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
				{/* Logo */}
				<Logo
					href="/dashboard"
					className="rounded-md px-2 py-1 hover:bg-accent"
				/>

				{/* Desktop Navigation */}
				<div className="flex items-center gap-2">
					<div className="hidden items-center gap-1 lg:flex">
						{navItems.map((link) => {
							const isActive = pathname === link.href;
							return (
								<Link
									key={link.href}
									href={link.href as never}
									className={cn(
										buttonVariants({ variant: "ghost" }),
										isActive && "bg-accent font-medium",
									)}
								>
									{link.label}
								</Link>
							);
						})}
					</div>

					{/* Right Actions */}
					<div className="flex items-center gap-2">
						{showOrgSwitcher && <OrganizationSwitcher />}
						{showThemeToggle && <ModeToggle />}
						{showUserMenu && <UserMenu />}
					</div>

					{/* Mobile Menu Toggle */}
					<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
						<Button
							size="icon"
							variant="ghost"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="lg:hidden"
							aria-label="Open menu"
						>
							<MenuIcon className="size-5" />
						</Button>
						<SheetContent
							side="left"
							className="gap-0 bg-background/95 p-0 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80"
							showCloseButton={false}
						>
							{/* Mobile Header */}
							<div className="border-b px-4 py-4">
								<Logo href="/dashboard" />
							</div>

							{/* Mobile Navigation */}
							<div className="grid gap-y-1 overflow-y-auto p-4">
								{navItems.map((link) => {
									const isActive = pathname === link.href;
									return (
										<Link
											key={link.href}
											href={link.href as never}
											onClick={() => setMobileMenuOpen(false)}
											className={cn(
												buttonVariants({
													variant: "ghost",
													className: "justify-start",
												}),
												isActive && "bg-accent font-medium",
											)}
										>
											{link.label}
										</Link>
									);
								})}
							</div>

							{/* Mobile Footer */}
							<SheetFooter className="mt-auto border-t p-4">
								<div className="flex w-full items-center justify-between">
									{showThemeToggle && <ModeToggle />}
									{showOrgSwitcher && (
										<div className="flex-1 px-2">
											<OrganizationSwitcher />
										</div>
									)}
								</div>
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</div>
			</nav>
		</header>
	);
}

const defaultNavItems: NavItem[] = [
	{ href: "/dashboard", label: "Dashboard" },
	{ href: "/surveys", label: "Surveys" },
];
