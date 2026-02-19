"use client";

import { FilePreview } from "./file-preview";

interface FileListProps {
	files: File[];
	onRemove: (index: number) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
	if (files.length === 0) return null;

	return (
		<div className="mt-3 space-y-2">
			{files.map((file, index) => (
				<FilePreview
					key={`${file.name}-${index}`}
					file={file}
					onRemove={() => onRemove(index)}
				/>
			))}
		</div>
	);
}
