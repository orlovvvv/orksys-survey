import type { QuestionConfig } from "@orksys-survey/db";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LinearScaleEditorProps {
	config: QuestionConfig;
	onChange: (config: QuestionConfig) => void;
}

export function LinearScaleEditor({
	config,
	onChange,
}: LinearScaleEditorProps) {
	const min = config.min ?? 1;
	const max = config.max ?? 5;

	const handleMinChange = (value: string) => {
		const newMin = value ? Number(value) : 1;
		onChange({ ...config, min: newMin });
	};

	const handleMaxChange = (value: string) => {
		const newMax = value ? Number(value) : 5;
		onChange({ ...config, max: newMax });
	};

	const scaleValues = [];
	for (let i = min; i <= max; i++) {
		scaleValues.push(i);
	}

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label className="text-xs uppercase tracking-wide">Min Value</Label>
					<Input
						type="number"
						value={min}
						onChange={(e) => handleMinChange(e.target.value)}
						min={0}
						max={max - 1}
					/>
				</div>
				<div className="space-y-2">
					<Label className="text-xs uppercase tracking-wide">Max Value</Label>
					<Input
						type="number"
						value={max}
						onChange={(e) => handleMaxChange(e.target.value)}
						min={min + 1}
						max={10}
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-xs uppercase tracking-wide">Step</Label>
				<Input
					type="number"
					value={config.step || 1}
					onChange={(e) =>
						onChange({
							...config,
							step: e.target.value ? Number(e.target.value) : 1,
						})
					}
					min={1}
					max={max - min}
				/>
			</div>

			<div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
				<span className="text-muted-foreground text-sm">Preview:</span>
				<div className="flex gap-1">
					{scaleValues.map((num) => (
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
