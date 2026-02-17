"use client";

import type { QuestionConfig } from "@orksys-survey/db";
import { Star } from "lucide-react";

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
						<Star
							// biome-ignore lint/suspicious/noArrayIndexKey: Static preview
							key={i}
							className="h-5 w-5 text-violet-500 fill-violet-500"
							aria-label="Star"
						/>
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
			<div className="rounded-lg bg-neutral-50 p-4">
				<p className="text-neutral-600 text-sm">
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
