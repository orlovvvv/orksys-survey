import type { LinkGroup } from "./types";

interface LinkGroupProps {
	group: LinkGroup;
}

export function LinkGroupComponent({ group }: LinkGroupProps) {
	return (
		<div>
			<h4 className="mb-4 font-semibold text-white">{group.title}</h4>
			<ul className="space-y-3">
				{group.links.map((link) => (
					<li key={link.label}>
						<a
							href={link.href}
							className="text-neutral-400 transition-colors hover:text-white"
						>
							{link.label}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
