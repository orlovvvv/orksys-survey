"use client";

import { Camera } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface AvatarUploadProps {
	name?: string;
	image?: string;
	onImageChange: (imageUrl: string) => void;
	disabled?: boolean;
	className?: string;
}

export function AvatarUpload({
	name,
	image,
	onImageChange,
	disabled = false,
	className,
}: AvatarUploadProps) {
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const [preview, setPreview] = React.useState<string | null>(null);

	const getInitials = (name?: string) => {
		if (!name) return "?";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const handleClick = () => {
		if (!disabled) {
			fileInputRef.current?.click();
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			return;
		}

		// Create preview
		const reader = new FileReader();
		reader.onloadend = () => {
			const result = reader.result as string;
			setPreview(result);
			onImageChange(result);
		};
		reader.readAsDataURL(file);
	};

	const displayImage = preview || image;

	return (
		<div className={className}>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileChange}
				className="hidden"
				disabled={disabled}
			/>
			<button
				type="button"
				onClick={handleClick}
				disabled={disabled}
				className="group relative"
			>
				<Avatar size="lg" className="h-24 w-24">
					{displayImage ? (
						<AvatarImage src={displayImage} alt={name || "Avatar"} />
					) : null}
					<AvatarFallback className="bg-primary text-primary-foreground text-xl">
						{getInitials(name)}
					</AvatarFallback>
				</Avatar>
				{!disabled && (
					<div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 transition-opacity hover:bg-background/90 group-hover:opacity-100">
						<Camera className="h-5 w-5" />
					</div>
				)}
			</button>
		</div>
	);
}
