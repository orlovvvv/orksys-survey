"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface CodeBlockProps {
	code: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			toast.success("Code copied!");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Failed to copy");
		}
	};

	return (
		<div className="relative">
			<pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 font-mono text-foreground text-sm">
				<code>{code}</code>
			</pre>
			<Button
				type="button"
				variant="outline"
				size="icon"
				className="absolute top-2 right-2"
				onClick={handleCopy}
			>
				{copied ? (
					<Check className="h-4 w-4 text-success" />
				) : (
					<Copy className="h-4 w-4" />
				)}
			</Button>
		</div>
	);
}
