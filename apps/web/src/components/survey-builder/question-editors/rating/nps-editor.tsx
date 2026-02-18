import type { QuestionConfig } from "@orksys-survey/db";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NPSEditorProps {
	config: QuestionConfig;
	onChange: (config: QuestionConfig) => void;
}

export function NPSEditor({ config }: NPSEditorProps) {
	return (
		<div className="space-y-4">
			<div className="rounded-lg bg-muted/50 p-4">
				<p className="text-muted-foreground text-sm">
					NPS uses a fixed 0-10 scale. Detractors (0-6), Passives (7-8),
					Promoters (9-10).
				</p>
			</div>

			<div className="space-y-2">
				<Label className="text-xs uppercase tracking-wide">Low Label</Label>
				<Input
					value={(config.min as number) === 0 ? "Not likely" : ""}
					placeholder="Not likely"
					disabled
				/>
			</div>

			<div className="space-y-2">
				<Label className="text-xs uppercase tracking-wide">High Label</Label>
				<Input placeholder="Extremely likely" disabled />
			</div>

			<div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
				<span className="text-muted-foreground text-sm">Preview:</span>
				<div className="flex gap-1">
					{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
						<div
							key={num}
							className="flex h-7 w-7 items-center justify-center rounded border border-border text-xs"
						>
							{num}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
