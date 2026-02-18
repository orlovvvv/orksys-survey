import { Bolt, Code, Plus, Settings } from "lucide-react";

export function SurveyMockupRightSidebar() {
	return (
		<div className="hidden h-full w-72 flex-col border-neutral-100 border-l bg-white lg:flex">
			<div className="border-neutral-100 border-b p-4">
				<div className="flex items-center justify-between">
					<h3 className="font-bold font-sans text-[10px] text-neutral-900 uppercase tracking-widest">
						Settings
					</h3>
					<Settings className="h-4 w-4 text-neutral-400" />
				</div>
			</div>
			<div className="space-y-6 overflow-y-auto p-5">
				{/* Toggle */}
				<div className="flex items-center justify-between">
					<div className="flex flex-col">
						<span className="font-semibold text-neutral-900 text-sm">
							Required
						</span>
						<span className="text-neutral-400 text-xs">
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
						<div className="h-5 w-9 rounded-full bg-neutral-200 after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full" />
					</label>
				</div>

				{/* Input */}
				<div className="space-y-2">
					<label className="font-semibold text-neutral-700 text-xs uppercase tracking-wide">
						Variable Name
					</label>
					<div className="relative">
						<input
							type="text"
							defaultValue="nps_score_q1"
							className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-neutral-900 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
							readOnly
						/>
						<Code className="absolute top-2.5 right-3 h-[14px] w-[14px] text-neutral-400" />
					</div>
				</div>

				{/* Logic */}
				<div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
					<div className="mb-3 flex items-center gap-2">
						<Bolt className="h-4 w-4 text-primary" />
						<span className="font-semibold text-neutral-900 text-sm">
							Skip Logic
						</span>
					</div>
					<p className="mb-3 text-neutral-600 text-xs leading-relaxed">
						Customize user paths based on responses.
					</p>
					<button
						type="button"
						className="w-full rounded-lg border border-primary/20 bg-white py-2 font-semibold text-primary text-xs transition-colors hover:bg-primary/5"
					>
						Add Rule
					</button>
				</div>

				{/* Design */}
				<div className="space-y-3 border-neutral-100 border-t pt-4">
					<label className="font-semibold text-neutral-700 text-xs uppercase tracking-wide">
						Appearance
					</label>
					<div className="flex gap-2">
						<button
							type="button"
							className="h-8 w-8 rounded-full bg-primary ring-2 ring-neutral-200 ring-offset-2"
							aria-label="Primary color"
						/>
						<button
							type="button"
							className="h-8 w-8 rounded-full bg-blue-500"
							aria-label="Blue color"
						/>
						<button
							type="button"
							className="h-8 w-8 rounded-full bg-neutral-900"
							aria-label="Dark color"
						/>
						<button
							type="button"
							className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200"
							aria-label="Custom color"
						>
							<Plus className="h-4 w-4 text-neutral-400" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
