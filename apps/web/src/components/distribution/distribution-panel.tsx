"use client";

import { Link2 } from "lucide-react";
import type React from "react";
import { CopyableField } from "./copyable-field";
import { EmbedCodePreview } from "./embed-code-preview";
import { QRCodeGenerator } from "./qr-code-generator";

interface DistributionPanelProps {
	slug: string;
	baseUrl?: string;
	className?: string;
}

export function DistributionPanel({
	slug,
	baseUrl = typeof window !== "undefined" ? window.location.origin : "",
	className,
}: DistributionPanelProps) {
	const surveyUrl = `${baseUrl}/s/${slug}`;

	return (
		<div className={className}>
			<div className="mb-6">
				<h2 className="font-semibold text-lg text-neutral-900">Distribution</h2>
				<p className="text-neutral-500 text-sm">
					Share your survey with respondents via link, QR code, or embed
				</p>
			</div>

			<div className="space-y-6">
				{/* Public URL */}
				<CopyableField
					value={surveyUrl}
					label="Public URL"
					className="max-w-md"
				/>

				{/* QR Code */}
				<QRCodeGenerator url={surveyUrl} filename={`${slug}-qr-code.png`} />

				{/* Embed Code */}
				<EmbedCodePreview slug={slug} baseUrl={baseUrl} />
			</div>
		</div>
	);
}
