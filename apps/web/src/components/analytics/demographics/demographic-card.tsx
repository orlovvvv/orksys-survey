"use client";

import { Monitor, Smartphone, Laptop } from "lucide-react";

import { BarChart } from "@/components/charts/bar-chart";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DeviceList } from "./device-list";

export interface DemographicItem {
	name: string;
	count: number;
	percentage: number;
}

interface DemographicCardProps {
	title: string;
	description: string;
	items: DemographicItem[];
	showDeviceIcons?: boolean;
}

const deviceIcons: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
	Desktop: Monitor,
	Mobile: Smartphone,
	Tablet: Laptop,
};

export function DemographicCard({
	title,
	description,
	items,
	showDeviceIcons,
}: DemographicCardProps) {
	if (items.length === 0) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				{showDeviceIcons ? (
					<DeviceList items={items} deviceIcons={deviceIcons} />
				) : (
					<BarChart
						data={items.map((item) => ({
							name: item.name,
							value: item.count,
						}))}
						height={200}
						horizontal
						formatter={(value) => `${value} responses`}
					/>
				)}
			</CardContent>
		</Card>
	);
}
