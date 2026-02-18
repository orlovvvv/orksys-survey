export function AudienceMockup() {
	return (
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
	);
}
