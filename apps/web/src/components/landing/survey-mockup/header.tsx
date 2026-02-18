import { Send } from "lucide-react";

export function SurveyMockupHeader() {
	return (
		<header className="z-20 flex shrink-0 flex-wrap items-center justify-between gap-4 border-neutral-100 border-b bg-white px-6 py-3">
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2 font-sans font-semibold text-neutral-900 text-sm">
					<span className="text-neutral-400">My Workspace /</span>
					<span>Product Feedback Q1</span>
				</div>
			</div>

			<div className="order-last flex w-full justify-center lg:order-none lg:w-auto">
				<div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
					<button className="rounded-md bg-white px-4 py-1.5 font-sans font-semibold text-neutral-900 text-xs shadow-sm">
						Build
					</button>
					<button className="px-4 py-1.5 font-sans font-semibold text-neutral-500 text-xs hover:text-neutral-900">
						Design
					</button>
					<button className="px-4 py-1.5 font-sans font-semibold text-neutral-500 text-xs hover:text-neutral-900">
						Share
					</button>
					<button className="px-4 py-1.5 font-sans font-semibold text-neutral-500 text-xs hover:text-neutral-900">
						Results
					</button>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<div className="hidden -space-x-2 sm:flex">
					<div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-pink-100 font-bold text-[10px] text-pink-600">
						JD
					</div>
					<div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-100 font-bold text-[10px] text-blue-600">
						AS
					</div>
				</div>
				<button
					type="button"
					className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-sans font-semibold text-white text-xs shadow-orange-500/20 shadow-sm transition-all hover:bg-primary/90"
				>
					Publish
					<Send className="h-4 w-4" />
				</button>
			</div>
		</header>
	);
}
