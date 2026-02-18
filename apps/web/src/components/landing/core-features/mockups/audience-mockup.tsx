export function AudienceMockup() {
	return (
		<div className="relative h-[240px] w-full select-none overflow-hidden rounded-2xl border border-border bg-muted p-4">
			<div className="flex h-full w-full flex-col rounded-xl border border-border bg-card shadow-sm">
				<div className="flex items-center justify-between border-border border-b px-4 py-3">
					<span className="font-bold font-sans text-[10px] text-foreground">
						Active Segment: Power Users
					</span>
					<div className="flex -space-x-1">
						<div className="h-5 w-5 rounded-full border border-background bg-muted" />
						<div className="h-5 w-5 rounded-full border border-background bg-muted-foreground/30" />
						<div className="h-5 w-5 rounded-full border border-background bg-muted-foreground/50" />
					</div>
				</div>
				<div className="space-y-2 p-2">
					<div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-[10px] text-primary">
							AL
						</div>
						<div className="flex-1">
							<div className="font-bold text-[10px] text-foreground">
								Ada Lovelace
							</div>
							<div className="text-[9px] text-muted-foreground">
								ada@example.com
							</div>
						</div>
						<div className="rounded border border-success/20 bg-success/10 px-2 py-0.5 text-[8px] text-success">
							Responded
						</div>
					</div>
					<div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-[10px] text-primary">
							GT
						</div>
						<div className="flex-1">
							<div className="font-bold text-[10px] text-foreground">
								Grace Turing
							</div>
							<div className="text-[9px] text-muted-foreground">
								grace@example.com
							</div>
						</div>
						<div className="rounded border border-border bg-muted px-2 py-0.5 text-[8px] text-muted-foreground">
							Pending
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
