"use client";

import { Download, QrCode } from "lucide-react";
import QRCodeLib from "qrcode";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface QRCodeGeneratorProps {
	url: string;
	size?: number;
	filename?: string;
}

export function QRCodeGenerator({
	url,
	size = 256,
	filename = "survey-qr-code.png",
}: QRCodeGeneratorProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [imageUrl, setImageUrl] = useState<string>("");
	const [isGenerating, setIsGenerating] = useState(true);

	useEffect(() => {
		let isMounted = true;

		const generateQRCode = async () => {
			setIsGenerating(true);
			try {
				if (canvasRef.current) {
					await QRCodeLib.toCanvas(canvasRef.current, url, {
						width: size,
						margin: 2,
						color: {
							dark: "hsl(var(--foreground))",
							light: "hsl(var(--background))",
						},
					});

					if (isMounted) {
						setImageUrl(canvasRef.current.toDataURL("image/png"));
					}
				}
			} catch (error) {
				console.error("Failed to generate QR code:", error);
			} finally {
				if (isMounted) {
					setIsGenerating(false);
				}
			}
		};

		generateQRCode();

		return () => {
			isMounted = false;
		};
	}, [url, size]);

	const handleDownload = () => {
		if (!imageUrl) return;

		const link = document.createElement("a");
		link.href = imageUrl;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<QrCode className="h-5 w-5" />
					QR Code
				</CardTitle>
				<CardDescription>
					Download a QR code that links directly to your survey
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col items-center gap-4">
				<div className="flex items-center justify-center rounded-lg border border-border bg-muted p-4">
					{isGenerating ? (
						<div
							className="animate-pulse rounded bg-border"
							style={{ width: size, height: size }}
						/>
					) : (
						<canvas ref={canvasRef} className="rounded" />
					)}
				</div>
				<Button
					onClick={handleDownload}
					disabled={!imageUrl || isGenerating}
					variant="outline"
					className="w-full"
				>
					<Download className="mr-2 h-4 w-4" />
					Download PNG
				</Button>
			</CardContent>
		</Card>
	);
}
