"use client";

import { useCallback, useMemo } from "react";
import { QuestionField } from "../question-field";
import type { BaseQuestionProps } from "../types";
import { DropZone } from "./drop-zone";
import { FileList } from "./file-list";

interface FileUploadConfig {
	maxFiles?: number;
	maxFileSize?: number;
	acceptedFileTypes?: string[];
}

export function FileUploadQuestion({
	question,
	value,
	onChange,
	error,
}: BaseQuestionProps) {
	const config = question.config as FileUploadConfig | undefined;
	const maxFiles = config?.maxFiles ?? 1;
	const maxFileSize = config?.maxFileSize ?? 10 * 1024 * 1024; // 10MB default
	const acceptedFileTypes = config?.acceptedFileTypes ?? [];

	const files = useMemo(() => (value as File[] | undefined) ?? [], [value]);

	const validateFile = useCallback(
		(file: File): string | null => {
			if (file.size > maxFileSize) {
				return `File "${file.name}" exceeds maximum size of ${maxFileSize / (1024 * 1024)}MB`;
			}
			if (
				acceptedFileTypes.length > 0 &&
				!acceptedFileTypes.includes(file.type)
			) {
				return `File type "${file.type}" is not allowed`;
			}
			return null;
		},
		[maxFileSize, acceptedFileTypes],
	);

	const handleFilesSelected = useCallback(
		(newFiles: File[]) => {
			const remainingSlots = maxFiles - files.length;
			const filesToAdd = newFiles.slice(0, remainingSlots);

			const validFiles: File[] = [];
			for (const file of filesToAdd) {
				const error = validateFile(file);
				if (!error) {
					validFiles.push(file);
				}
			}

			if (validFiles.length > 0) {
				onChange([...files, ...validFiles]);
			}
		},
		[files, maxFiles, validateFile, onChange],
	);

	const handleRemove = useCallback(
		(index: number) => {
			const newFiles = files.filter((_, i) => i !== index);
			onChange(newFiles);
		},
		[files, onChange],
	);

	return (
		<QuestionField question={question} error={error}>
			<DropZone
				onFilesSelected={handleFilesSelected}
				maxFiles={maxFiles}
				acceptedFileTypes={acceptedFileTypes}
				disabled={files.length >= maxFiles}
			/>
			<FileList files={files} onRemove={handleRemove} />
		</QuestionField>
	);
}
