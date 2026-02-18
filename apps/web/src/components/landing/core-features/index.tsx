import { GitBranch } from "lucide-react";

import { Section, SectionHeader } from "../ui";
import { coreFeatures } from "./config";
import { FeatureCard } from "./feature-card";

export function CoreFeatures() {
	return (
		<Section>
			<div className="relative overflow-hidden rounded-[32px] bg-card p-6 ring-1 ring-border md:p-8">
				<SectionHeader
					label="Platform"
					title="Everything you need to understand your audience"
					description="Handshake provides a streamlined interface for building complex surveys, managing audiences, and extracting value from feedback."
					action={
						<a
							href="#"
							className="group flex items-center gap-2 font-medium font-sans text-primary text-sm transition-colors hover:text-primary/80"
						>
							View integration list
							<GitBranch className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</a>
					}
				/>

				{/* Bento Grid Layout */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{coreFeatures.map((feature) => (
						<FeatureCard
							key={feature.title}
							badge={feature.badge}
							title={feature.title}
							description={feature.description}
							layout={feature.layout}
							mockup={<feature.mockup />}
						/>
					))}
				</div>
			</div>
		</Section>
	);
}
