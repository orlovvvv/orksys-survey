import { Handshake } from "lucide-react";

export function BrandSection() {
	return (
		<div className="space-y-8">
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
					<Handshake className="h-6 w-6 text-white" />
				</div>
				<span className="font-bold text-white text-xl">Handshake</span>
			</div>

			<p className="max-w-md text-zinc-300">
				Create beautiful, effective surveys in minutes. Understand your
				customers better and make data-driven decisions.
			</p>
		</div>
	);
}
