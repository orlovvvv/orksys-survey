"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CopyableFieldProps {
	value: string;
	label?: string;
	readOnly?: boolean;
	className?: string;
}

export function CopyableField({
	value,
	label,
	readOnly = true,
	className,
}: CopyableFieldProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			toast.success("Copied to clipboard");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Failed to copy");
		}
	};

	return (
		<div className={className}>
			{label && (
				<label className="mb-1.5 block font-medium text-foreground text-sm">
					{label}
				</label>
			)}
			<div className="flex gap-2">
				<Input value={value} readOnly={readOnly} className="flex-1" />
				<Button
					type="button"
					variant="outline"
					size="icon"
					onClick={handleCopy}
					className="shrink-0"
				>
					{copied ? (
						<Check className="h-4 w-4 text-success" />
					) : (
						<Copy className="h-4 w-4" />
					)}
				</Button>
			</div>
		</div>
	);
}
