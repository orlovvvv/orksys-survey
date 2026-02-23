"use client";

import { FileIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface FilePreviewProps {
	file: File;
	onRemove: () => void;
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
	const [preview, setPreview] = useState<string | null>(null);
	const isImage = file.type.startsWith("image/");

	useEffect(() => {
		if (isImage) {
			const url = URL.createObjectURL(file);
			setPreview(url);
			return () => URL.revokeObjectURL(url);
		}
		return () => {};
	}, [file, isImage]);

	const formatSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	return (
		<div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
			<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-muted">
				{isImage && preview ? (
					<img
						src={preview}
						alt={file.name}
						className="h-full w-full rounded object-cover"
					/>
				) : (
					<FileIcon className="h-5 w-5 text-muted-foreground" />
				)}
			</div>
			<div className="min-w-0 flex-1">
				<p className="truncate font-medium text-sm">{file.name}</p>
				<p className="text-muted-foreground text-xs">{formatSize(file.size)}</p>
			</div>
			<button
				type="button"
				onClick={onRemove}
				className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded hover:bg-destructive/10 hover:text-destructive"
			>
				<XIcon className="h-4 w-4" />
			</button>
		</div>
	);
}
