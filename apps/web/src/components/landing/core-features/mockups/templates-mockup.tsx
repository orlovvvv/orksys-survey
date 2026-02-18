import { Heart, Rocket, ShoppingCart, Users } from "lucide-react";

export function TemplatesMockup() {
	return (
		<div className="relative h-[240px] w-full select-none overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
			<div className="grid grid-cols-2 gap-3">
				<div className="flex flex-col gap-2 rounded-lg border border-neutral-100 bg-white p-3 shadow-sm">
					<div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">
						<Heart className="h-[14px] w-[14px]" strokeWidth={2} />
					</div>
					<div className="h-1.5 w-16 rounded-full bg-neutral-200" />
					<div className="h-1 w-10 rounded-full bg-neutral-100" />
				</div>
				<div className="flex flex-col gap-2 rounded-lg border border-neutral-100 bg-white p-3 shadow-sm">
					<div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">
						<ShoppingCart className="h-[14px] w-[14px]" strokeWidth={2} />
					</div>
					<div className="h-1.5 w-14 rounded-full bg-neutral-200" />
					<div className="h-1 w-8 rounded-full bg-neutral-100" />
				</div>
				<div className="flex flex-col gap-2 rounded-lg border border-neutral-100 bg-white p-3 shadow-sm">
					<div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">
						<Users className="h-[14px] w-[14px]" strokeWidth={2} />
					</div>
					<div className="h-1.5 w-12 rounded-full bg-neutral-200" />
					<div className="h-1 w-8 rounded-full bg-neutral-100" />
				</div>
				<div className="flex flex-col gap-2 rounded-lg border border-neutral-100 bg-white p-3 shadow-sm">
					<div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">
						<Rocket className="h-[14px] w-[14px]" strokeWidth={2} />
					</div>
					<div className="h-1.5 w-16 rounded-full bg-neutral-200" />
					<div className="h-1 w-10 rounded-full bg-neutral-100" />
				</div>
			</div>
		</div>
	);
}
