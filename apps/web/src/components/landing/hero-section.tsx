import { ArrowRight, Mail } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

export function HeroSection({ className }: { className?: string }) {
	return (
		<section
			className={cn(
				"mesh-gradient relative overflow-hidden pt-36 pb-20",
				className,
			)}
		>
			<div className="mx-auto max-w-7xl px-6 text-center">
				<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/50 px-3 py-1 backdrop-blur">
					<span className="font-sans font-semibold text-[10px] text-neutral-500 uppercase tracking-widest">
						By ORK Systems
					</span>
				</div>
				<h1 className="mx-auto mb-6 max-w-4xl bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text font-display font-normal text-5xl text-transparent leading-[1.1] tracking-tight md:text-7xl">
					Beautiful surveys. <br />
					Actionable{" "}
					<span className="bg-gradient-to-r from-violet-600 to-violet-500 bg-clip-text font-display font-normal text-transparent">
						insights.
					</span>
				</h1>
				<p className="mx-auto mb-10 max-w-2xl font-sans text-lg text-neutral-600 leading-relaxed md:text-xl">
					The modern platform to capture feedback, measure sentiment, and make
					data-driven decisions with effortless survey experiences.
				</p>

				<div className="mx-auto mb-20 flex w-full max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row">
					<div className="group relative w-full sm:w-80">
						<div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
							<Mail className="h-[18px] w-[18px] text-neutral-400 transition-colors group-focus-within:text-violet-500/60" />
						</div>
						<input
							type="email"
							placeholder="work@company.com"
							className="w-full rounded-full border border-neutral-200 bg-white/80 px-6 py-4 pl-12 font-medium text-base text-neutral-900 shadow-sm outline-none backdrop-blur-sm transition-all placeholder:text-neutral-400 hover:border-neutral-300 focus:border-violet-500/40 focus:ring-4 focus:ring-violet-500/10"
						/>
					</div>
					<button
						type="button"
						className="group relative overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-violet-600 px-8 py-4 font-medium text-white shadow-lg shadow-violet-500/30 transition-all duration-300 hover:shadow-violet-500/50"
					>
						<div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
						<span className="relative flex items-center gap-2 font-sans">
							Start for free
							<ArrowRight className="h-5 w-5" />
						</span>
					</button>
				</div>
			</div>
		</section>
	);
}
