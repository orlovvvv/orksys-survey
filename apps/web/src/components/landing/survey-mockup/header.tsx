import { Send } from "lucide-react";

export function SurveyMockupHeader() {
	return (
		<header className="z-20 flex shrink-0 flex-wrap items-center justify-between gap-4 border-border border-b bg-card px-6 py-3">
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2 font-sans font-semibold text-foreground text-sm">
					<span className="text-muted-foreground">My Workspace /</span>
					<span>Product Feedback Q1</span>
				</div>
			</div>

			<div className="order-last flex w-full justify-center lg:order-none lg:w-auto">
				<div className="flex gap-1 rounded-lg bg-muted p-1">
					<button className="rounded-md bg-card px-4 py-1.5 font-sans font-semibold text-foreground text-xs shadow-sm">
						Build
					</button>
					<button className="px-4 py-1.5 font-sans font-semibold text-muted-foreground text-xs hover:text-foreground">
						Design
					</button>
					<button className="px-4 py-1.5 font-sans font-semibold text-muted-foreground text-xs hover:text-foreground">
						Share
					</button>
					<button className="px-4 py-1.5 font-sans font-semibold text-muted-foreground text-xs hover:text-foreground">
						Results
					</button>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<div className="hidden -space-x-2 sm:flex">
					<div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary/10 font-bold text-[10px] text-primary">
						JD
					</div>
					<div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary/10 font-bold text-[10px] text-primary">
						AS
					</div>
				</div>
				<button
					type="button"
					className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-sans font-semibold text-white text-xs shadow-primary/20 shadow-sm transition-all hover:bg-primary/90"
				>
					Publish
					<Send className="h-4 w-4" />
				</button>
			</div>
		</header>
	);
}
