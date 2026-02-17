import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Company logos using SVG representations
 * Each logo is a simple SVG-based representation for the mockup
 */

function CompanyLogo({
	name,
	svgContent,
}: {
	name: string;
	svgContent: string;
}) {
	return (
		<div
			className="mask-image h-8 w-24 bg-neutral-800"
			style={{
				maskImage: `url('data:image/svg+xml;base64,${svgContent}')`,
				WebkitMaskImage: `url('data:image/svg+xml;base64,${svgContent}')`,
				backgroundColor: "black",
			}}
			aria-label={name}
		/>
	);
}

const companyLogos: Array<{ name: string; svg: string }> = [
	{
		name: "Acme",
		svg: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMzAiPjxwYXRoIGQ9Ik0xMCwxNWw1LC01bDUsNW0tMTAsNWw1LC01bDUsNSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PHRleHQgeD0iMzAiIHk9IjIwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPkFDTUU8L3RleHQ+PC9zdmc+",
	},
	{
		name: "Vertex",
		svg: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMzAiPjxjaXJjbGUgY3g9IjE1IiBjeT0iMTUiIHI9IjUiIGZpbGw9ImJsYWNrIi8+PHRleHQgeD0iMzAiIHk9IjIwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPlZvcnRleDwvdGV4dD48L3N2Zz4=",
	},
	{
		name: "Quantum",
		svg: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMzAiPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSJibGFjayIvPjx0ZXh0IHg9IjMwIiB5PSIyMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSJib2xkIj5RdWFudHVtPC90ZXh0Pjwvc3ZnPg==",
	},
	{
		name: "Apex",
		svg: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMzAiPjxwb2x5Z29uIHBvaW50cz0iMTUsNSAyMCwyNSAxMCwyNSIgZmlsbD0iYmxhY2siLz48dGV4dCB4PSIzMCIgeT0iMjAiIGZvbnQtZmFtaWx5PSJzYW5zLXNZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPkFwZXg8L3RleHQ+PC9zdmc+",
	},
];

export function SocialProof({ className }: { className?: string }) {
	return (
		<div className={cn("mt-16 w-full px-6 pt-6", className)}>
			<div className="text-center">
				<p className="font-sans font-semibold text-neutral-400 text-xs uppercase tracking-widest">
					Trusted by product teams at
				</p>
			</div>
			<div className="mt-8 flex flex-wrap justify-center gap-8 opacity-60 grayscale transition-all duration-500 hover:grayscale-0 md:gap-12">
				{companyLogos.map((logo) => (
					<CompanyLogo key={logo.name} name={logo.name} svgContent={logo.svg} />
				))}
			</div>
		</div>
	);
}
