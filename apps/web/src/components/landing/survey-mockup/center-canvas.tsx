import { GitBranch } from "lucide-react";

import { cn } from "@/lib/utils";

export function SurveyMockupCenterCanvas() {
	return (
		<div className="relative flex flex-1 items-center overflow-y-auto bg-muted/50 px-4 py-6 md:px-8 md:py-10">
			{/* Survey Card */}
			<div className="relative mx-auto w-full max-w-[600px] overflow-hidden rounded-2xl border border-border bg-card shadow-border/50 shadow-xl">
				{/* Progress Bar */}
				<div className="h-1.5 w-full bg-muted">
					<div className="h-full w-[40%] rounded-r-full bg-primary" />
				</div>

				<div className="p-6 md:p-10">
					<div className="mb-8">
						<span className="mb-2 block font-bold text-[10px] text-primary uppercase tracking-widest">
							Question 2 of 4
						</span>
						<h2 className="font-display font-semibold text-foreground text-xl leading-tight md:text-2xl">
							How likely are you to recommend Handshake to a colleague or
							friend?
						</h2>
						<p className="mt-2 text-muted-foreground text-sm">
							Your feedback helps us improve the platform.
						</p>
					</div>

					{/* Interactive NPS Scale Mockup */}
					<div className="mb-4 flex flex-wrap justify-center gap-1 sm:justify-between sm:gap-0">
						{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
							<button
								key={num}
								type="button"
								className={cn(
									"h-9 w-9 rounded-lg border font-semibold text-sm transition-all sm:h-10 sm:w-10",
									num === 9
										? "scale-105 transform border-primary bg-primary text-white shadow-lg shadow-primary/30"
										: "border-border text-muted-foreground hover:border-primary hover:bg-primary/5 hover:text-primary",
								)}
							>
								{num}
							</button>
						))}
					</div>
					<div className="flex justify-between font-medium text-muted-foreground text-xs uppercase tracking-wide">
						<span>Not likely</span>
						<span className="hidden sm:inline">Extremely likely</span>
						<span className="sm:hidden">Likely</span>
					</div>

					<div className="mt-8 flex flex-col-reverse justify-between gap-4 border-border border-t pt-8 sm:flex-row sm:items-center">
						<span className="text-center text-muted-foreground text-xs sm:text-left">
							Powered by <strong>Handshake</strong>
						</span>
						<button
							type="button"
							className="rounded-lg bg-foreground px-6 py-2.5 font-semibold text-background text-sm transition-colors hover:bg-foreground/80"
						>
							Next Question
						</button>
					</div>
				</div>
			</div>

			{/* Logic Visualization Overlay - Hidden on mobile */}
			<div className="absolute top-4 right-4 z-10 hidden w-48 rounded-xl border border-border bg-card p-3 shadow-lg lg:top-20 lg:block">
				<div className="mb-2 flex items-center gap-2">
					<GitBranch className="h-4 w-4 text-primary" />
					<span className="font-bold text-foreground text-xs uppercase">
						Logic Flow
					</span>
				</div>
				<div className="space-y-2 text-[10px] text-muted-foreground">
					<div className="flex items-center gap-2">
						<div className="h-1.5 w-1.5 rounded-full bg-success" />
						<span>If score &gt; 8 → "Review"</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="h-1.5 w-1.5 rounded-full bg-destructive" />
						<span>If score &lt; 6 → "Support"</span>
					</div>
				</div>
			</div>
		</div>
	);
}
