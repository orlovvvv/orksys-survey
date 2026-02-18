import { Bolt, Code, Plus, Settings } from "lucide-react";

export function SurveyMockupRightSidebar() {
	return (
		<div className="hidden h-full w-72 flex-col border-border border-l bg-card lg:flex">
			<div className="border-border border-b p-4">
				<div className="flex items-center justify-between">
					<h3 className="font-bold font-sans text-[10px] text-foreground uppercase tracking-widest">
						Settings
					</h3>
					<Settings className="h-4 w-4 text-muted-foreground" />
				</div>
			</div>
			<div className="space-y-6 overflow-y-auto p-5">
				{/* Toggle */}
				<div className="flex items-center justify-between">
					<div className="flex flex-col">
						<span className="font-semibold text-foreground text-sm">
							Required
						</span>
						<span className="text-muted-foreground text-xs">
							Respondents must answer
						</span>
					</div>
					<label className="relative inline-flex cursor-pointer items-center">
						<input
							type="checkbox"
							defaultChecked
							className="peer sr-only"
							readOnly
						/>
						<div className="h-5 w-9 rounded-full bg-muted after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-border after:bg-card after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full" />
					</label>
				</div>

				{/* Input */}
				<div className="space-y-2">
					<label className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
						Variable Name
					</label>
					<div className="relative">
						<input
							type="text"
							defaultValue="nps_score_q1"
							className="w-full rounded-lg border border-border bg-muted px-3 py-2 font-mono text-foreground text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
							readOnly
						/>
						<Code className="absolute top-2.5 right-3 h-[14px] w-[14px] text-muted-foreground" />
					</div>
				</div>

				{/* Logic */}
				<div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
					<div className="mb-3 flex items-center gap-2">
						<Bolt className="h-4 w-4 text-primary" />
						<span className="font-semibold text-foreground text-sm">
							Skip Logic
						</span>
					</div>
					<p className="mb-3 text-muted-foreground text-xs leading-relaxed">
						Customize user paths based on responses.
					</p>
					<button
						type="button"
						className="w-full rounded-lg border border-primary/20 bg-card py-2 font-semibold text-primary text-xs transition-colors hover:bg-primary/5"
					>
						Add Rule
					</button>
				</div>

				{/* Design */}
				<div className="space-y-3 border-border border-t pt-4">
					<label className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
						Appearance
					</label>
					<div className="flex gap-2">
						<button
							type="button"
							className="h-8 w-8 rounded-full bg-primary ring-2 ring-border ring-offset-2"
							aria-label="Primary color"
						/>
						<button
							type="button"
							className="h-8 w-8 rounded-full bg-blue-500"
							aria-label="Blue color"
						/>
						<button
							type="button"
							className="h-8 w-8 rounded-full bg-foreground"
							aria-label="Dark color"
						/>
						<button
							type="button"
							className="flex h-8 w-8 items-center justify-center rounded-full border border-border"
							aria-label="Custom color"
						>
							<Plus className="h-4 w-4 text-muted-foreground" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
