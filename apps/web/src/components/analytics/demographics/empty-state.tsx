"use client";

import { Globe } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";

interface DemographicsEmptyStateProps {
	title: string;
	description: string;
}

export function DemographicsEmptyState({
	title,
	description,
}: DemographicsEmptyStateProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Demographics</CardTitle>
				<CardDescription>
					Breakdown by device, browser, and location
				</CardDescription>
			</CardHeader>
			<CardContent>
				<EmptyState icon={Globe} title={title} description={description} />
			</CardContent>
		</Card>
	);
}
