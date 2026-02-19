"use client";

import type { QuestionConfig } from "@orksys-survey/db";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailEditorProps {
	config: QuestionConfig;
	onChange: (config: QuestionConfig) => void;
}

export function EmailEditor({ config, onChange }: EmailEditorProps) {
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
					placeholder="email@example.com"
				/>
			</div>

			<div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 p-3">
				<Mail className="h-4 w-4 text-muted-foreground" />
				<div className="flex flex-col">
					<span className="font-medium text-foreground text-sm">
						Email Validation
					</span>
					<span className="text-muted-foreground text-xs">
						Automatic format validation enabled
					</span>
				</div>
			</div>
		</motion.div>
	);
}
