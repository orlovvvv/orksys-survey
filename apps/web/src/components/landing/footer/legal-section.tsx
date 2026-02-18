import type { LegalLink } from "./types";

interface LegalSectionProps {
	links: LegalLink[];
}

export function LegalSection({ links }: LegalSectionProps) {
	return (
		<div className="mt-12 border-zinc-700 border-t pt-8">
			<div className="flex flex-col flex-wrap justify-between gap-4 sm:flex-row sm:items-center">
				<p className="text-sm text-zinc-400">
					© 2025 Handshake. All rights reserved.
				</p>
				<div className="flex gap-6">
					{links.map((link) => (
						<a
							key={link.label}
							href={link.href}
							className="text-sm text-zinc-400 transition-colors hover:text-zinc-200"
						>
							{link.label}
						</a>
					))}
				</div>
			</div>
		</div>
	);
}
