"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import {
	Card,
	CardContent,
} from "@/components/ui/card";
import { orpc } from "@/utils/orpc";

import { DemographicCard } from "./demographic-card";
import { DemographicsEmptyState } from "./empty-state";

interface DemographicsPanelProps {
	surveyId: string;
}

interface DemographicsData {
	browsers: { name: string; count: number; percentage: number }[];
	devices: { name: string; count: number; percentage: number }[];
	os: { name: string; count: number; percentage: number }[];
	countries: { name: string; count: number; percentage: number }[];
}

export function DemographicsPanel({ surveyId }: DemographicsPanelProps) {
	const demographics = useQuery(
		orpc.analytics.getDemographics.queryOptions({ input: { surveyId } }),
	);

	if (demographics.isLoading) {
		return (
			<div className="flex h-[400px] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	const data: DemographicsData | undefined = demographics.data;

	if (!data) {
		return (
			<Card>
				<CardContent className="flex h-[200px] items-center justify-center">
					<p className="text-muted-foreground text-sm">
						No demographic data available
					</p>
				</CardContent>
			</Card>
		);
	}

	const hasData =
		data.browsers.length > 0 ||
		data.devices.length > 0 ||
		data.os.length > 0 ||
		data.countries.length > 0;

	if (!hasData) {
		return (
			<DemographicsEmptyState
				title="No Demographic Data"
				description="Demographic data will appear when responses include metadata"
			/>
		);
	}

	return (
		<div className="grid gap-6 md:grid-cols-2">
			<DemographicCard
				title="Browsers"
				description="Top browsers used by respondents"
				items={data.browsers}
			/>
			<DemographicCard
				title="Devices"
				description="Device types used by respondents"
				items={data.devices}
				showDeviceIcons
			/>
			<DemographicCard
				title="Operating Systems"
				description="OS breakdown of respondents"
				items={data.os}
			/>
			<DemographicCard
				title="Countries"
				description="Top countries of respondents"
				items={data.countries}
			/>
		</div>
	);
}
