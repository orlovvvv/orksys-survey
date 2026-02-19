"use client";

import { UploadIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
	onFilesSelected: (files: File[]) => void;
	maxFiles: number;
	acceptedFileTypes: string[];
	disabled?: boolean;
}

export function DropZone({
	onFilesSelected,
	maxFiles,
	acceptedFileTypes,
	disabled,
}: DropZoneProps) {
	const [isDragging, setIsDragging] = useState(false);

	const handleDragOver = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			if (!disabled) setIsDragging(true);
		},
		[disabled],
	);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			if (disabled) return;

			const files = Array.from(e.dataTransfer.files);
			onFilesSelected(files);
		},
		[onFilesSelected, disabled],
	);

	const handleFileInput = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(e.target.files ?? []);
			onFilesSelected(files);
			e.target.value = "";
		},
		[onFilesSelected],
	);

	return (
		<label
			className={cn(
				"mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-input border-dashed px-6 py-10 transition-colors",
				isDragging && "border-primary bg-accent",
				disabled && "cursor-not-allowed opacity-50",
			)}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<input
				type="file"
				className="hidden"
				onChange={handleFileInput}
				multiple={maxFiles > 1}
				accept={
					acceptedFileTypes.length > 0 ? acceptedFileTypes.join(",") : undefined
				}
				disabled={disabled}
			/>
			<UploadIcon className="mb-2 h-8 w-8 text-muted-foreground" />
			<p className="text-muted-foreground text-sm">
				Drag and drop files here, or click to select
			</p>
			<p className="mt-1 text-muted-foreground text-xs">
				Up to {maxFiles} file{maxFiles > 1 ? "s" : ""}
			</p>
		</label>
	);
}
