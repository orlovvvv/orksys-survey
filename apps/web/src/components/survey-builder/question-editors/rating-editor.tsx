"use client";

import type { QuestionConfig } from "@orksys-survey/db";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RatingEditorProps {
	config: QuestionConfig;
	onChange: (config: QuestionConfig) => void;
	type: "rating" | "nps" | "linear_scale";
}

export function RatingEditor({ config, onChange, type }: RatingEditorProps) {
	if (type === "nps") {
		return <NPSEditor config={config} onChange={onChange} />;
	}

	if (type === "linear_scale") {
		return <LinearScaleEditor config={config} onChange={onChange} />;
	}

	return <RatingScaleEditor config={config} onChange={onChange} />;
}

function RatingScaleEditor({
	config,
	onChange,
}: {
	config: QuestionConfig;
	onChange: (config: QuestionConfig) => void;
}) {
	const handleMaxChange = (value: string) => {
		const max = value ? Math.min(10, Math.max(1, Number(value))) : 5;
		onChange({ ...config, max });
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label className="text-xs uppercase tracking-wide">
					Maximum Rating
				</Label>
				<div className="flex items-center gap-2">
					<Input
						type="number"
						value={config.max || 5}
						onChange={(e) => handleMaxChange(e.target.value)}
						min={1}
						max={10}
						className="w-20"
					/>
					<span className="text-neutral-500 text-sm">stars</span>
				</div>
			</div>

			<div className="flex items-center justify-between rounded-lg bg-neutral-50 p-3">
				<span className="text-neutral-600 text-sm">Preview:</span>
				<div className="flex gap-1">
					{Array.from({ length: config.max || 5 }).map((_, i) => (
						<svg
							// biome-ignore lint/suspicious/noArrayIndexKey: Static preview
							key={i}
							className="h-5 w-5 text-violet-500"
							fill="currentColor"
							viewBox="0 0 20 20"
							aria-label="Star"
							role="img"
						>
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
					))}
				</div>
			</div>
		</div>
	);
}

function NPSEditor({
	config,
}: {
	config: QuestionConfig;
	onChange: (config: QuestionConfig) => void;
}) {
	return (
		<div className="space-y-4">
			<div className="rounded-lg bg-blue-50 p-4">
				<p className="text-blue-900 text-sm">
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

			<div className="flex items-center justify-between rounded-lg bg-neutral-50 p-3">
				<span className="text-neutral-600 text-sm">Preview:</span>
				<div className="flex gap-1">
					{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
						<div
							key={num}
							className="flex h-7 w-7 items-center justify-center rounded border border-neutral-200 text-xs"
						>
							{num}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function LinearScaleEditor({
	config,
	onChange,
}: {
	config: QuestionConfig;
	onChange: (config: QuestionConfig) => void;
}) {
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

			<div className="flex items-center justify-between rounded-lg bg-neutral-50 p-3">
				<span className="text-neutral-600 text-sm">Preview:</span>
				<div className="flex gap-1">
					{scaleValues.map((num) => (
						<div
							key={num}
							className="flex h-7 w-7 items-center justify-center rounded border border-neutral-200 text-xs"
						>
							{num}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
