import type { ReactNode } from "react";

interface FeatureCardProps {
	badge: string;
	title: string;
	description: string;
	mockup: ReactNode;
	layout?: "vertical" | "horizontal";
}

export function FeatureCard({
	badge,
	title,
	description,
	mockup,
	layout = "vertical",
}: FeatureCardProps) {
	const isHorizontal = layout === "horizontal";

	return (
		<article
			className={`group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-neutral-200 bg-white p-8 transition-all duration-300 hover:shadow-lg ${isHorizontal ? "md:col-span-2 lg:col-span-2" : ""}`}
		>
			<div className="relative z-10">
				<div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-sans font-semibold text-primary text-xs tracking-medium">
					{badge}
				</div>
				<h3 className="mb-3 font-display font-normal text-2xl text-neutral-900 tracking-tight">
					{title}
				</h3>
				<p className="mb-8 font-sans text-neutral-500 text-sm leading-relaxed">
					{description}
				</p>
			</div>
			{mockup}
		</article>
	);
}
