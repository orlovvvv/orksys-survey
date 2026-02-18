import type { LegalLink } from "./types";

interface LegalSectionProps {
	links: LegalLink[];
}

export function LegalSection({ links }: LegalSectionProps) {
	return (
		<div className="mt-12 border-neutral-800 border-t pt-8">
			<div className="flex flex-col flex-wrap justify-between gap-4 sm:flex-row sm:items-center">
				<p className="text-neutral-500 text-sm">
					© 2025 Handshake. All rights reserved.
				</p>
				<div className="flex gap-6">
					{links.map((link) => (
						<a
							key={link.label}
							href={link.href}
							className="text-neutral-500 text-sm transition-colors hover:text-neutral-400"
						>
							{link.label}
						</a>
					))}
				</div>
			</div>
		</div>
	);
}
