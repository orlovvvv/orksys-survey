export function LogicFlowMockup() {
	return (
		<div className="relative flex h-[240px] w-full select-none flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted p-4">
			<div className="absolute inset-0 bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] opacity-50 [background-size:16px_16px]" />

			{/* Node 1 */}
			<div className="relative z-10 w-32 rounded-lg border border-border bg-card px-3 py-2 text-center font-semibold text-[10px] text-muted-foreground shadow-sm">
				Q1: Satisfaction?
			</div>

			{/* Lines */}
			<div className="relative my-1 h-8 w-px bg-border">
				<div className="absolute top-1/2 left-1/2 h-px w-16 -translate-x-1/2 bg-border" />
			</div>

			<div className="flex w-full justify-center gap-4">
				<div className="flex flex-col items-center">
					<div className="mb-1 h-4 w-px bg-border" />
					<div className="z-10 w-24 rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-center font-semibold text-[10px] text-success shadow-sm">
						Ask for Review
					</div>
				</div>
				<div className="flex flex-col items-center">
					<div className="mb-1 h-4 w-px bg-border" />
					<div className="z-10 w-24 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-center font-semibold text-[10px] text-destructive shadow-sm">
						Contact Support
					</div>
				</div>
			</div>
		</div>
	);
}
