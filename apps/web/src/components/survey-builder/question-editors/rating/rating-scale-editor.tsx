import type { QuestionConfig } from "@orksys-survey/db";
import { Star } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RatingScaleEditorProps {
	config: QuestionConfig;
	onChange: (config: QuestionConfig) => void;
}

export function RatingScaleEditor({
	config,
	onChange,
}: RatingScaleEditorProps) {
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
					<span className="text-muted-foreground text-sm">stars</span>
				</div>
			</div>

			<div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
				<span className="text-muted-foreground text-sm">Preview:</span>
				<div className="flex gap-1">
					{Array.from({ length: config.max || 5 }).map((_, i) => (
						<Star
							// biome-ignore lint/suspicious/noArrayIndexKey: Static preview
							key={i}
							className="h-5 w-5 fill-primary text-primary"
							aria-label="Star"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
