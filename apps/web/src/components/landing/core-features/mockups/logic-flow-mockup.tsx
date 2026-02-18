export function LogicFlowMockup() {
	return (
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
	);
}
