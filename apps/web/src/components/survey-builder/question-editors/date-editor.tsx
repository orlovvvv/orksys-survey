"use client";

import type { QuestionConfig } from "@orksys-survey/db";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateEditorProps {
	config: QuestionConfig;
	onChange: (config: QuestionConfig) => void;
}

export function DateEditor({ config, onChange }: DateEditorProps) {
	const placeholder = config.placeholder ?? "";

	return (
		<motion.div
			className="space-y-4"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.1 }}
		>
			<div className="space-y-2">
				<Label className="text-xs uppercase tracking-wide">Placeholder</Label>
				<Input
					value={placeholder}
					onChange={(e) => onChange({ ...config, placeholder: e.target.value })}
					placeholder="Select a date"
				/>
			</div>
		</motion.div>
	);
}
