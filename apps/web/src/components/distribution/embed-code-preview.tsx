"use client";

import { Code, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmbedCodePreviewProps {
	slug: string;
	baseUrl?: string;
}

interface EmbedConfig {
	title: string;
	code: string;
}

export function EmbedCodePreview({
	slug,
	baseUrl = "",
}: EmbedCodePreviewProps) {
	const [copiedTab, setCopiedTab] = useState<string | null>(null);

	const surveyUrl = `${baseUrl}/s/${slug}`;

	const embeds: Record<string, EmbedConfig> = {
		iframe: {
			title: "Iframe",
			code: `<iframe
  src="${surveyUrl}"
  width="100%"
  height="600px"
  frameborder="0"
  allowfullscreen>
</iframe>`,
		},
		popup: {
			title: "Popup",
			code: `<script>
  (function() {
    var script = document.createElement('script');
    script.src = "${baseUrl}/embed/${slug}.js";
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`,
		},
		"inline-button": {
			title: "Button",
			code: `<a href="${surveyUrl}" target="_blank" rel="noopener">
  <button style="padding: 12px 24px; font-size: 16px; cursor: pointer; background: #000; color: #fff; border: none; border-radius: 6px;">
    Take Survey
  </button>
</a>`,
		},
	};

	const handleCopy = async (code: string, tabKey: string) => {
		try {
			await navigator.clipboard.writeText(code);
			setCopiedTab(tabKey);
			toast.success("Embed code copied!");
			setTimeout(() => setCopiedTab(null), 2000);
		} catch {
			toast.error("Failed to copy");
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Code className="h-5 w-5" />
					Embed Code
				</CardTitle>
				<CardDescription>
					Copy and paste this code into your website
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="iframe">
					<TabsList variant="line">
						{Object.entries(embeds).map(([key, { title }]) => (
							<TabsTrigger key={key} value={key}>
								{title}
							</TabsTrigger>
						))}
					</TabsList>
					{Object.entries(embeds).map(([key, { title, code }]) => (
						<TabsContent key={key} value={key} className="mt-4">
							<div className="relative">
								<pre className="overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4 font-mono text-neutral-800 text-sm">
									<code>{code}</code>
								</pre>
								<Button
									type="button"
									variant="outline"
									size="icon"
									className="absolute top-2 right-2"
									onClick={() => handleCopy(code, key)}
								>
									{copiedTab === key ? (
										<svg
											className="h-4 w-4 text-green-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									) : (
										<Copy className="h-4 w-4" />
									)}
								</Button>
							</div>
						</TabsContent>
					))}
				</Tabs>
			</CardContent>
		</Card>
	);
}
