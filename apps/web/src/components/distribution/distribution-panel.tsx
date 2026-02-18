"use client";

import { AlertCircle, Code, Link2, QrCode } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyableField } from "./copyable-field";
import { EmbedCodePreview } from "./embed-code-preview";
import { QRCodeGenerator } from "./qr-code-generator";

interface DistributionPanelProps {
	orgSlug: string;
	surveySlug: string;
	status?: string;
	baseUrl?: string;
	className?: string;
}

export function DistributionPanel({
	orgSlug,
	surveySlug,
	status = "draft",
	baseUrl = typeof window !== "undefined" ? window.location.origin : "",
	className,
}: DistributionPanelProps) {
	const surveyUrl = `${baseUrl}/s/${orgSlug}/${surveySlug}`;
	const isPublished = status === "published";

	return (
		<div className={className}>
			<div className="mb-6">
				<h2 className="font-semibold text-foreground text-lg">Distribution</h2>
				<p className="text-muted-foreground text-sm">
					Share your survey with respondents via link, QR code, or embed
				</p>
			</div>

			{!isPublished && (
				<>
					<Alert className="mb-6 border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900/30 dark:bg-orange-900/10 dark:text-orange-400">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Survey Not Published</AlertTitle>
						<AlertDescription>
							This survey is not yet published. Publish it to make it accessible
							to respondents.
						</AlertDescription>
					</Alert>
					<Separator className="mb-6" />
				</>
			)}

			<Tabs defaultValue="link" className="w-full">
				<TabsList className="grid w-full max-w-md grid-cols-3">
					<TabsTrigger value="link">
						<Link2 className="mr-2 h-4 w-4" />
						Link
					</TabsTrigger>
					<TabsTrigger value="qr">
						<QrCode className="mr-2 h-4 w-4" />
						QR Code
					</TabsTrigger>
					<TabsTrigger value="embed">
						<Code className="mr-2 h-4 w-4" />
						Embed
					</TabsTrigger>
				</TabsList>

				<TabsContent value="link" className="mt-6">
					<CopyableField
						value={surveyUrl}
						label="Public URL"
						className="max-w-md"
					/>
				</TabsContent>

				<TabsContent value="qr" className="mt-6">
					<QRCodeGenerator
						url={surveyUrl}
						filename={`${surveySlug}-qr-code.png`}
					/>
				</TabsContent>

				<TabsContent value="embed" className="mt-6">
					<EmbedCodePreview
						orgSlug={orgSlug}
						surveySlug={surveySlug}
						baseUrl={baseUrl}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
