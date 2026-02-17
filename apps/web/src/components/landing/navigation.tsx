import { Handshake } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

export function Navigation({ className }: { className?: string }) {
	return (
		<nav
			className={cn(
				"fixed top-6 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 px-4",
				className,
			)}
		>
			<div className="flex items-center justify-between rounded-full border border-white/10 bg-zinc-900 px-4 py-2 pr-3 shadow-xl backdrop-blur-md">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2 font-display font-semibold text-white tracking-tight">
						<Handshake className="h-[22px] w-[22px] text-violet-500" />
						Handshake
					</div>
				</div>
				<div className="hidden items-center gap-6 md:flex">
					<a
						href="#"
						className="font-sans text-neutral-400 text-sm transition-colors hover:text-white"
					>
						Product
					</a>
					<a
						href="#"
						className="font-sans text-neutral-400 text-sm transition-colors hover:text-white"
					>
						Templates
					</a>
					<a
						href="#"
						className="font-sans text-neutral-400 text-sm transition-colors hover:text-white"
					>
						Enterprise
					</a>
					<a
						href="#"
						className="font-sans text-neutral-400 text-sm transition-colors hover:text-white"
					>
						Resources
					</a>
				</div>
				<div className="flex items-center gap-4">
					<a
						href="#"
						className="hidden font-sans font-semibold text-neutral-400 text-sm transition-colors hover:text-white sm:block"
					>
						Login
					</a>
					<button
						type="button"
						className="group relative overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-violet-600 px-6 py-2.5 font-semibold text-white text-xs shadow-lg shadow-violet-500/30 transition-all duration-300 hover:shadow-violet-500/50"
					>
						<div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
						<span className="relative font-sans">Create Survey</span>
					</button>
				</div>
			</div>
		</nav>
	);
}
