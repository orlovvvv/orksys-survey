"use client";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

interface SlugDisplayProps {
	orgSlug: string;
	surveySlug: string;
}

export function SlugDisplay({ orgSlug, surveySlug }: SlugDisplayProps) {
	return (
		<div className="space-y-2">
			<Label>Survey URL</Label>
			<InputGroup>
				<InputGroupAddon align="inline-start">
					<InputGroupText>/{orgSlug}/</InputGroupText>
				</InputGroupAddon>
				<InputGroupInput disabled value={surveySlug || "untitled"} />
			</InputGroup>
			<p className="text-muted-foreground text-xs">
				URL is automatically generated from the survey title
			</p>
		</div>
	);
}
