"use client";

import { useQuery } from "@tanstack/react-query";
import { Globe, Laptop, Loader2, Monitor, Smartphone } from "lucide-react";

import { BarChart } from "@/components/charts/bar-chart";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { orpc } from "@/utils/orpc";

interface DemographicsPanelProps {
	surveyId: string;
}

interface DemographicItem {
	name: string;
	count: number;
	percentage: number;
}

interface DemographicsData {
	browsers: DemographicItem[];
	devices: DemographicItem[];
	os: DemographicItem[];
	countries: DemographicItem[];
}

const deviceIcons: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
	Desktop: Monitor,
	Mobile: Smartphone,
	Tablet: Laptop,
};

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
			<Card>
				<CardHeader>
					<CardTitle>Demographics</CardTitle>
					<CardDescription>
						Breakdown by device, browser, and location
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center gap-4 py-8 text-center">
						<Globe className="h-12 w-12 text-muted-foreground" />
						<div>
							<h3 className="font-semibold">No Demographic Data</h3>
							<p className="mt-1 text-muted-foreground text-sm">
								Demographic data will appear when responses include metadata
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid gap-6 md:grid-cols-2">
			{/* Browsers */}
			{data.browsers.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Browsers</CardTitle>
						<CardDescription>Top browsers used by respondents</CardDescription>
					</CardHeader>
					<CardContent>
						<BarChart
							data={data.browsers.map((b: DemographicItem) => ({
								name: b.name,
								value: b.count,
							}))}
							height={200}
							horizontal
							formatter={(value) => `${value} responses`}
						/>
					</CardContent>
				</Card>
			)}

			{/* Devices */}
			{data.devices.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Devices</CardTitle>
						<CardDescription>Device types used by respondents</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{data.devices.map((d: DemographicItem, i: number) => {
								const Icon = deviceIcons[d.name] || Monitor;
								return (
									<div key={i} className="flex items-center gap-4">
										<Icon className="h-5 w-5 text-muted-foreground" />
										<div className="flex-1">
											<div className="mb-1 flex items-center justify-between">
												<span className="font-medium text-sm">{d.name}</span>
												<span className="text-muted-foreground text-sm">
													{d.percentage}%
												</span>
											</div>
											<div className="h-2 w-full rounded-full bg-muted">
												<div
													className="h-full rounded-full bg-primary transition-all"
													style={{ width: `${d.percentage}%` }}
												/>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Operating Systems */}
			{data.os.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Operating Systems</CardTitle>
						<CardDescription>OS breakdown of respondents</CardDescription>
					</CardHeader>
					<CardContent>
						<BarChart
							data={data.os.map((o: DemographicItem) => ({
								name: o.name,
								value: o.count,
							}))}
							height={200}
							horizontal
							formatter={(value) => `${value} responses`}
						/>
					</CardContent>
				</Card>
			)}

			{/* Countries */}
			{data.countries.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Countries</CardTitle>
						<CardDescription>Top countries of respondents</CardDescription>
					</CardHeader>
					<CardContent>
						<BarChart
							data={data.countries.map((c: DemographicItem) => ({
								name: c.name,
								value: c.count,
							}))}
							height={200}
							horizontal
							formatter={(value) => `${value} responses`}
						/>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
