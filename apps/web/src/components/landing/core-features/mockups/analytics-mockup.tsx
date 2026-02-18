export function AnalyticsMockup() {
	return (
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
						<span className="font-bold text-lg text-neutral-900">75%</span>
						<span className="text-[8px] text-neutral-400">Positive</span>
					</div>
				</div>
			</div>
		</div>
	);
}
