"use client";

import { Code } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "./code-block";

interface EmbedCodePreviewProps {
	orgSlug: string;
	surveySlug: string;
	baseUrl?: string;
}

interface EmbedConfig {
	title: string;
	code: string;
}

export function EmbedCodePreview({
	orgSlug,
	surveySlug,
	baseUrl = "",
}: EmbedCodePreviewProps) {
	const surveyUrl = `${baseUrl}/s/${orgSlug}/${surveySlug}`;

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
    script.src = "${baseUrl}/embed/${orgSlug}/${surveySlug}.js";
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`,
		},
		"inline-button": {
			title: "Button",
			code: `<a href="${surveyUrl}" target="_blank" rel="noopener">
  <button style="padding: 12px 24px; font-size: 16px; cursor: pointer; background: hsl(var(--foreground)); color: hsl(var(--background)); border: none; border-radius: 6px;">
    Take Survey
  </button>
</a>`,
		},
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
					{Object.entries(embeds).map(([key, { code }]) => (
						<TabsContent key={key} value={key} className="mt-4">
							<CodeBlock code={code} />
						</TabsContent>
					))}
				</Tabs>
			</CardContent>
		</Card>
	);
}
