"use client";

import type { QuestionConfig } from "@orksys-survey/db";
import { motion } from "framer-motion";
import { FileAudio, FileImage, FileText, FileVideo } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FileUploadEditorProps {
	config: QuestionConfig;
	onChange: (config: QuestionConfig) => void;
}

const FILE_TYPE_CATEGORIES = [
	{
		id: "image",
		label: "Images",
		icon: FileImage,
		types: ["image/jpeg", "image/png", "image/gif", "image/webp"],
	},
	{
		id: "document",
		label: "Documents",
		icon: FileText,
		types: [
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"text/plain",
		],
	},
	{
		id: "video",
		label: "Video",
		icon: FileVideo,
		types: ["video/mp4", "video/webm", "video/quicktime"],
	},
	{
		id: "audio",
		label: "Audio",
		icon: FileAudio,
		types: ["audio/mpeg", "audio/wav", "audio/ogg"],
	},
];

export function FileUploadEditor({ config, onChange }: FileUploadEditorProps) {
	const maxFiles = config.maxFiles ?? 1;
	const maxFileSize = config.maxFileSize ?? 10 * 1024 * 1024; // 10MB in bytes
	const acceptedFileTypes = config.acceptedFileTypes ?? [];

	const handleMaxFilesChange = (value: string) => {
		const numValue = value === "" ? 1 : Number.parseInt(value, 10);
		onChange({ ...config, maxFiles: Math.max(1, numValue) });
	};

	const handleMaxFileSizeChange = (value: string) => {
		const mbValue = value === "" ? 10 : Number.parseInt(value, 10);
		onChange({ ...config, maxFileSize: Math.max(1, mbValue) * 1024 * 1024 });
	};

	const toggleFileTypeCategory = (
		category: (typeof FILE_TYPE_CATEGORIES)[0],
	) => {
		const currentTypes = new Set(acceptedFileTypes);
		const allCategoryTypesPresent = category.types.every((t) =>
			currentTypes.has(t),
		);

		if (allCategoryTypesPresent) {
			// Remove all types from this category
			for (const t of category.types) {
				currentTypes.delete(t);
			}
		} else {
			// Add all types from this category
			for (const t of category.types) {
				currentTypes.add(t);
			}
		}

		onChange({ ...config, acceptedFileTypes: Array.from(currentTypes) });
	};

	const isCategorySelected = (category: (typeof FILE_TYPE_CATEGORIES)[0]) => {
		return category.types.every((t) => acceptedFileTypes.includes(t));
	};

	return (
		<motion.div
			className="space-y-4"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.1 }}
		>
			<div className="grid grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label className="text-xs uppercase tracking-wide">Max Files</Label>
					<Input
						type="number"
						min={1}
						max={10}
						value={maxFiles}
						onChange={(e) => handleMaxFilesChange(e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label className="text-xs uppercase tracking-wide">
						Max Size (MB)
					</Label>
					<Input
						type="number"
						min={1}
						max={100}
						value={Math.round(maxFileSize / (1024 * 1024))}
						onChange={(e) => handleMaxFileSizeChange(e.target.value)}
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-xs uppercase tracking-wide">
					Allowed File Types
				</Label>
				<p className="text-muted-foreground text-xs">
					Select categories or leave empty to allow all types
				</p>
				<div className="grid grid-cols-2 gap-2">
					{FILE_TYPE_CATEGORIES.map((category) => {
						const Icon = category.icon;
						const selected = isCategorySelected(category);
						return (
							<Button
								key={category.id}
								variant={selected ? "default" : "outline"}
								size="sm"
								className={cn(
									"justify-start",
									selected && "bg-primary text-primary-foreground",
								)}
								onClick={() => toggleFileTypeCategory(category)}
							>
								<Icon className="mr-2 h-4 w-4" />
								{category.label}
							</Button>
						);
					})}
				</div>
			</div>
		</motion.div>
	);
}
