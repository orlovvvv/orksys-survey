"use client";

import type { DemographicItem } from "./demographic-card";

interface DeviceListProps {
	items: DemographicItem[];
	deviceIcons: Record<string, React.ComponentType<{ className?: string }>>;
}

export function DeviceList({ items, deviceIcons }: DeviceListProps) {
	return (
		<div className="space-y-4">
			{items.map((d, i) => {
				const Icon = deviceIcons[d.name] || deviceIcons.Desktop;
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
	);
}
