import { Logo } from "@/components/brand";

export function BrandSection() {
	return (
		<div className="space-y-8">
			<Logo
				showByline
				size="lg"
				className="[&_[class*='text-muted-foreground']]:text-zinc-400 [&_span]:text-white"
			/>

			<p className="max-w-md text-zinc-300">
				Create beautiful, effective surveys in minutes. Understand your
				customers better and make data-driven decisions.
			</p>
		</div>
	);
}
