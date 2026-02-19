"use client";

import type { Question } from "@orksys-survey/db";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChoiceEditor } from "../question-editors/choice-editor";
import { DateEditor } from "../question-editors/date-editor";
import { EmailEditor } from "../question-editors/email-editor";
import { FileUploadEditor } from "../question-editors/file-upload-editor";
import { PhoneEditor } from "../question-editors/phone-editor";
import { RatingEditor } from "../question-editors/rating-editor";

interface TypeSpecificEditorProps {
	question: Question;
	onConfigChange: (config: Question["config"]) => void;
}

export function TypeSpecificEditor({
	question,
	onConfigChange,
}: TypeSpecificEditorProps) {
	const config = question.config || {};

	switch (question.type) {
		case "multiple_choice":
		case "checkbox":
		case "dropdown":
			return (
				<ChoiceEditor
					config={config}
					onChange={onConfigChange}
					allowMultiple={question.type === "checkbox"}
				/>
			);

		case "rating":
		case "nps":
		case "linear_scale":
			return (
				<RatingEditor
					config={config}
					onChange={onConfigChange}
					type={question.type}
				/>
			);

		case "text":
		case "textarea":
			return (
				<motion.div
					className="space-y-4"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<div className="space-y-2">
						<Label className="text-xs uppercase tracking-wide">
							Placeholder
						</Label>
						<Input
							value={config.placeholder || ""}
							onChange={(e) =>
								onConfigChange({ ...config, placeholder: e.target.value })
							}
							placeholder="Enter placeholder text"
						/>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label className="text-xs uppercase tracking-wide">Min</Label>
							<Input
								type="number"
								value={config.minLength || ""}
								onChange={(e) =>
									onConfigChange({
										...config,
										minLength: e.target.value
											? Number(e.target.value)
											: undefined,
									})
								}
								placeholder="0"
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-xs uppercase tracking-wide">Max</Label>
							<Input
								type="number"
								value={config.maxLength || ""}
								onChange={(e) =>
									onConfigChange({
										...config,
										maxLength: e.target.value
											? Number(e.target.value)
											: undefined,
									})
								}
								placeholder="500"
							/>
						</div>
					</div>
				</motion.div>
			);

		case "file_upload":
			return <FileUploadEditor config={config} onChange={onConfigChange} />;

		case "date":
			return <DateEditor config={config} onChange={onConfigChange} />;

		case "email":
			return <EmailEditor config={config} onChange={onConfigChange} />;

		case "phone":
			return <PhoneEditor config={config} onChange={onConfigChange} />;

		default:
			return null;
	}
}
