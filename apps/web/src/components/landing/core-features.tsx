import { GitBranch, Heart, Rocket, ShoppingCart, Users } from "lucide-react";

import { Section, SectionHeader } from "./ui";

export function CoreFeatures() {
	return (
		<Section>
			<div className="relative overflow-hidden rounded-[32px] bg-white p-6 ring-1 ring-neutral-200 md:p-8">
				<SectionHeader
					label="Platform"
					title="Everything you need to understand your audience"
					description="Handshake provides a streamlined interface for building complex surveys, managing audiences, and extracting value from feedback."
					action={
						<a
							href="#"
							className="group flex items-center gap-2 font-medium font-sans text-primary text-sm transition-colors hover:text-primary/80"
						>
							View integration list
							<GitBranch className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</a>
					}
				/>

				{/* Bento Grid Layout */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{/* Card 1: Smart Logic (Vertical) */}
					<article className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-neutral-200 bg-white p-8 transition-all duration-300 hover:shadow-lg">
						<div className="relative z-10">
							<div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-sans font-semibold text-primary text-xs tracking-medium">
								Logic & Branching
							</div>
							<h3 className="mb-3 font-display font-normal text-2xl text-neutral-900 tracking-tight">
								Personalized paths.
							</h3>
							<p className="mb-8 font-sans text-neutral-500 text-sm leading-relaxed">
								Create dynamic experiences that adapt based on previous answers,
								increasing completion rates.
							</p>
						</div>

						{/* UI Mockup: Logic Flow */}
						<div className="relative flex h-[240px] w-full select-none flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
							<div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-50 [background-size:16px_16px]" />

							{/* Node 1 */}
							<div className="relative z-10 w-32 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-center font-semibold text-[10px] text-neutral-700 shadow-sm">
								Q1: Satisfaction?
							</div>

							{/* Lines */}
							<div className="relative my-1 h-8 w-px bg-neutral-300">
								<div className="absolute top-1/2 left-1/2 h-px w-16 -translate-x-1/2 bg-neutral-300" />
							</div>

							<div className="flex w-full justify-center gap-4">
								<div className="flex flex-col items-center">
									<div className="mb-1 h-4 w-px bg-neutral-300" />
									<div className="z-10 w-24 rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-center font-semibold text-[10px] text-green-700 shadow-sm">
										Ask for Review
									</div>
								</div>
								<div className="flex flex-col items-center">
									<div className="mb-1 h-4 w-px bg-neutral-300" />
									<div className="z-10 w-24 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-center font-semibold text-[10px] text-red-700 shadow-sm">
										Contact Support
									</div>
								</div>
							</div>
						</div>
					</article>

					{/* Card 2: Analytics (Horizontal) */}
					<article className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-neutral-200 bg-white p-8 transition-all duration-300 hover:shadow-lg md:col-span-2 lg:col-span-2">
						<div className="relative z-10 max-w-lg">
							<div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-sans font-semibold text-primary text-xs tracking-medium">
								Data Visualization
							</div>
							<h3 className="mb-3 font-display font-normal text-2xl text-neutral-900 tracking-tight">
								Dashboards that enlighten.
							</h3>
							<p className="mb-8 font-sans text-neutral-500 text-sm leading-relaxed">
								Instant aggregation of responses into clean, exportable charts.
								Track NPS, CSAT, and CES over time effortlessly.
							</p>
						</div>

						{/* UI Mockup: Charts */}
						<div className="relative flex h-[240px] w-full select-none gap-6 overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 p-6">
							{/* Chart 1: NPS */}
							<div className="flex flex-1 flex-col justify-between rounded-xl border border-neutral-100 bg-white p-4 shadow-sm">
								<div className="flex items-start justify-between">
									<div>
										<p className="font-bold font-sans text-[10px] text-neutral-400 uppercase">
											Net Promoter Score
										</p>
										<p className="mt-1 font-bold font-display text-3xl text-neutral-900">
											62
										</p>
									</div>
									<span className="rounded-full bg-green-100 px-1.5 py-0.5 font-bold text-[9px] text-green-600">
										+4.2%
									</span>
								</div>
								<div className="mt-2 flex h-20 items-end gap-1">
									<div className="h-[30%] w-1/6 rounded-t bg-neutral-100" />
									<div className="h-[40%] w-1/6 rounded-t bg-neutral-100" />
									<div className="h-[20%] w-1/6 rounded-t bg-neutral-100" />
									<div className="h-[60%] w-1/6 rounded-t bg-primary/60" />
									<div className="h-[80%] w-1/6 rounded-t bg-primary/80" />
									<div className="h-[90%] w-1/6 rounded-t bg-primary" />
								</div>
							</div>

							{/* Chart 2: Donut */}
							<div className="flex w-48 flex-col items-center justify-center rounded-xl border border-neutral-100 bg-white p-4 shadow-sm">
								<p className="mb-3 self-start font-bold font-sans text-[10px] text-neutral-400 uppercase">
									Sentiment
								</p>
								<div className="relative h-24 w-24">
									<svg
										viewBox="0 0 36 36"
										className="h-full w-full"
										role="img"
										aria-label="75% positive sentiment"
									>
										<path
											d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
											fill="none"
											stroke="#eee"
											strokeWidth="4"
										/>
										<path
											d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
											fill="none"
											stroke="hsl(var(--primary))"
											strokeWidth="4"
											strokeDasharray="75, 100"
										/>
									</svg>
									<div className="absolute inset-0 flex flex-col items-center justify-center">
										<span className="font-bold text-lg text-neutral-900">
											75%
										</span>
										<span className="text-[8px] text-neutral-400">
											Positive
										</span>
									</div>
								</div>
							</div>
						</div>
					</article>

					{/* Card 3: Audience (Horizontal) */}
					<article className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-neutral-200 bg-white p-8 transition-all duration-300 hover:shadow-lg md:col-span-2 lg:col-span-2">
						<div className="relative z-10 max-w-lg">
							<div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-sans font-semibold text-primary text-xs tracking-medium">
								Audience Management
							</div>
							<h3 className="mb-3 font-display font-normal text-2xl text-neutral-900 tracking-tight">
								Target the right users.
							</h3>
							<p className="mb-8 font-sans text-neutral-500 text-sm leading-relaxed">
								Segment your users based on attributes and behavior. Send
								surveys via email, link, or in-app embed.
							</p>
						</div>

						{/* UI Mockup: User List */}
						<div className="relative h-[240px] w-full select-none overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
							<div className="flex h-full w-full flex-col rounded-xl border border-neutral-200 bg-white shadow-sm">
								<div className="flex items-center justify-between border-neutral-100 border-b px-4 py-3">
									<span className="font-bold font-sans text-[10px] text-neutral-900">
										Active Segment: Power Users
									</span>
									<div className="flex -space-x-1">
										<div className="h-5 w-5 rounded-full border border-white bg-neutral-200" />
										<div className="h-5 w-5 rounded-full border border-white bg-neutral-300" />
										<div className="h-5 w-5 rounded-full border border-white bg-neutral-400" />
									</div>
								</div>
								<div className="space-y-2 p-2">
									<div className="flex items-center gap-3 rounded-lg p-2 hover:bg-neutral-50">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 font-bold text-[10px] text-purple-600">
											AL
										</div>
										<div className="flex-1">
											<div className="font-bold text-[10px] text-neutral-900">
												Ada Lovelace
											</div>
											<div className="text-[9px] text-neutral-400">
												ada@example.com
											</div>
										</div>
										<div className="rounded border border-green-100 bg-green-50 px-2 py-0.5 text-[8px] text-green-600">
											Responded
										</div>
									</div>
									<div className="flex items-center gap-3 rounded-lg p-2 hover:bg-neutral-50">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 font-bold text-[10px] text-orange-600">
											GT
										</div>
										<div className="flex-1">
											<div className="font-bold text-[10px] text-neutral-900">
												Grace Turing
											</div>
											<div className="text-[9px] text-neutral-400">
												grace@example.com
											</div>
										</div>
										<div className="rounded border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[8px] text-neutral-500">
											Pending
										</div>
									</div>
								</div>
							</div>
						</div>
					</article>

					{/* Card 4: Templates (Vertical) */}
					<article className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-neutral-200 bg-white p-8 transition-all duration-300 hover:shadow-lg">
						<div className="relative z-10">
							<div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-sans font-semibold text-primary text-xs tracking-medium">
								Templates
							</div>
							<h3 className="mb-3 font-display font-normal text-2xl text-neutral-900 tracking-tight">
								Start in seconds.
							</h3>
							<p className="mb-8 font-sans text-neutral-500 text-sm leading-relaxed">
								Browse 50+ expert-verified templates for Product Market Fit,
								CSAT, Onboarding, and more.
							</p>
						</div>

						{/* UI Mockup: Template Grid */}
						<div className="relative h-[240px] w-full select-none overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
							<div className="grid grid-cols-2 gap-3">
								<div className="flex flex-col gap-2 rounded-lg border border-neutral-100 bg-white p-3 shadow-sm">
									<div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">
										<Heart className="h-[14px] w-[14px]" strokeWidth={2} />
									</div>
									<div className="h-1.5 w-16 rounded-full bg-neutral-200" />
									<div className="h-1 w-10 rounded-full bg-neutral-100" />
								</div>
								<div className="flex flex-col gap-2 rounded-lg border border-neutral-100 bg-white p-3 shadow-sm">
									<div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">
										<ShoppingCart
											className="h-[14px] w-[14px]"
											strokeWidth={2}
										/>
									</div>
									<div className="h-1.5 w-14 rounded-full bg-neutral-200" />
									<div className="h-1 w-8 rounded-full bg-neutral-100" />
								</div>
								<div className="flex flex-col gap-2 rounded-lg border border-neutral-100 bg-white p-3 shadow-sm">
									<div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">
										<Users className="h-[14px] w-[14px]" strokeWidth={2} />
									</div>
									<div className="h-1.5 w-12 rounded-full bg-neutral-200" />
									<div className="h-1 w-8 rounded-full bg-neutral-100" />
								</div>
								<div className="flex flex-col gap-2 rounded-lg border border-neutral-100 bg-white p-3 shadow-sm">
									<div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">
										<Rocket className="h-[14px] w-[14px]" strokeWidth={2} />
									</div>
									<div className="h-1.5 w-16 rounded-full bg-neutral-200" />
									<div className="h-1 w-10 rounded-full bg-neutral-100" />
								</div>
							</div>
						</div>
					</article>
				</div>
			</div>
		</Section>
	);
}
