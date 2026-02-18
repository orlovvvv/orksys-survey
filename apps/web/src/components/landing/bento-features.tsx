import { GitBranch, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";

import { Section, SectionHeader } from "./ui";

export function BentoFeatures() {
	return (
		<Section
			background="white"
			className="relative overflow-hidden border-neutral-200 border-y"
		>
			<SectionHeader
				label="Why Handshake?"
				title="Turn scattered feedback into a competitive engine."
				description="Guesswork is the enemy of growth. Handshake unifies your customer voice into a single, unbreakable source of truth."
			/>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				{/* Security Card */}
				<div className="group flex h-[520px] flex-col justify-between rounded-[40px] border border-neutral-200/60 bg-neutral-50 px-10 py-10 transition-all duration-500 hover:shadow-primary/5 hover:shadow-xl">
					<div>
						<div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
							<ShieldCheck className="h-6 w-6" strokeWidth={1.5} />
						</div>
						<h3 className="mb-6 font-display font-normal text-2xl text-neutral-900 leading-tight tracking-tight">
							Anonymous & Secure by default.
						</h3>
						<p className="font-sans text-neutral-500 leading-relaxed">
							Your respondent data is protected by multi-layer encryption and
							GDPR compliance, ensuring trust in every interaction.
						</p>
					</div>
					<div className="border-neutral-100 border-t pt-6">
						<span className="font-bold font-sans text-neutral-400 text-xs uppercase tracking-widest">
							Enterprise Ready
						</span>
					</div>
				</div>

				{/* Visual Card */}
				<div className="group relative h-[520px] overflow-hidden rounded-[40px] bg-neutral-900">
					<div className="absolute inset-0">
						<Image
							src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
							alt="Data visualization"
							fill
							className="object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
							sizes="(max-width: 768px) 100vw, 25vw"
						/>
					</div>
					<div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
					<div className="absolute bottom-10 left-10 pr-10 text-white">
						<span className="mb-4 inline-block rounded-full bg-primary px-3 py-1 font-bold font-sans text-[10px] uppercase tracking-widest">
							Live Analytics
						</span>
						<p className="font-display font-normal text-2xl leading-tight">
							Visualize sentiment trends as they happen, not weeks later.
						</p>
					</div>
				</div>

				{/* Completion Rate Card */}
				<div className="group relative flex h-[520px] flex-col items-center justify-between overflow-hidden rounded-[40px] border border-neutral-200 bg-neutral-50 px-10 py-10 shadow-sm">
					<div className="text-center">
						<span className="mb-2 block font-bold font-sans text-primary text-xs uppercase tracking-[0.2em]">
							Optimization
						</span>
						<span className="font-medium font-sans text-neutral-900 text-xl">
							Completion Rate
						</span>
					</div>
					<div className="relative flex h-56 w-56 items-center justify-center">
						<div className="absolute inset-0 animate-pulse rounded-full bg-primary/5" />
						<div className="absolute inset-0 rounded-full border-[14px] border-neutral-100" />
						<svg
							className="absolute inset-0 h-full w-full -rotate-90 transform"
							viewBox="0 0 100 100"
							role="img"
							aria-label="94% completion rate"
						>
							<circle
								cx="50"
								cy="50"
								r="43"
								fill="none"
								stroke="hsl(var(--primary))"
								strokeWidth="7"
								strokeDasharray="270 360"
								strokeLinecap="round"
							/>
						</svg>
						<div className="font-display font-normal text-5xl text-neutral-900 tracking-tighter">
							94%
						</div>
					</div>
					<button className="w-full rounded-[20px] bg-neutral-900 py-4 font-sans font-semibold text-sm text-white shadow-lg shadow-neutral-200 transition-colors duration-300 hover:bg-primary">
						See Case Studies
					</button>
				</div>

				{/* AI Analysis Card */}
				<div className="relative flex h-[520px] flex-col justify-between rounded-[40px] bg-neutral-950 p-10 text-white transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
					<div className="flex items-start justify-between">
						<span className="font-medium font-sans text-lg text-primary tracking-tight">
							AI Analysis
						</span>
						<div className="rounded-full bg-white/10 p-2">
							<Sparkles className="h-5 w-5 text-white" />
						</div>
					</div>
					<p className="font-display font-normal text-3xl leading-[1.2]">
						Let AI summarize thousands of text responses instantly.
					</p>
					<div className="space-y-6">
						<div className="group/link cursor-pointer">
							<p className="mb-1 font-sans text-neutral-500 text-xs uppercase tracking-widest">
								Processing Time
							</p>
							<p className="border-white/10 border-b pb-2 font-medium font-sans text-lg transition-colors group-hover/link:text-primary">
								Seconds, not days
							</p>
						</div>
						<div className="group/link cursor-pointer">
							<p className="mb-1 font-sans text-neutral-500 text-xs uppercase tracking-widest">
								Capabilities
							</p>
							<p className="font-medium font-sans text-lg transition-colors group-hover/link:text-primary">
								Sentiment & Keywords
							</p>
						</div>
					</div>
				</div>
			</div>
		</Section>
	);
}
