"use client";

import { Handshake } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function Navigation({ className }: { className?: string }) {
	const { data: session } = authClient.useSession();
	const isLoggedIn = !!session;

	return (
		<nav className={cn("w-full max-w-4xl px-4", className)}>
			<div className="flex w-full min-w-0 items-center rounded-full border border-white/10 bg-zinc-900 px-3 py-2 shadow-xl backdrop-blur-md sm:px-4">
				{/* Logo - always visible, left side */}
				<Link
					href="/"
					className="flex shrink-0 items-center gap-2 font-display font-semibold text-white tracking-tight"
				>
					<Handshake className="h-5 w-5 text-primary sm:h-[22px] sm:w-[22px]" />
					<span className="hidden sm:inline">Handshake</span>
				</Link>

				{/* Center - nav links or spacer */}
				<div className="flex flex-1 items-center justify-center">
					<div className="hidden items-center gap-4 lg:gap-6 xl:flex">
						<Link
							href="#features"
							className="whitespace-nowrap font-sans text-sm text-zinc-400 transition-colors hover:text-white"
						>
							Product
						</Link>
						<Link
							href="#pricing"
							className="whitespace-nowrap font-sans text-sm text-zinc-400 transition-colors hover:text-white"
						>
							Pricing
						</Link>
						<Link
							href="#testimonials"
							className="whitespace-nowrap font-sans text-sm text-zinc-400 transition-colors hover:text-white"
						>
							Reviews
						</Link>
						<Link
							href={"/s/demo/demo" as Route}
							className="whitespace-nowrap font-sans text-sm text-zinc-400 transition-colors hover:text-white"
						>
							Demo
						</Link>
					</div>
				</div>

				{/* Right side - CTA button */}
				<Link
					href={isLoggedIn ? "/surveys/new" : "/login"}
					className="group relative shrink-0 overflow-hidden rounded-full bg-gradient-to-r from-primary to-primary px-4 py-2 font-semibold text-white text-xs shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-primary/50 sm:px-5 sm:py-2.5"
				>
					<div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
					<span className="relative font-sans">
						{isLoggedIn ? "Create Survey" : "Sign Up"}
					</span>
				</Link>
			</div>
		</nav>
	);
}
