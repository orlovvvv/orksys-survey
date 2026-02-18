import { CreditCard, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { Button } from "../ui/button";

import { Section } from "./ui";

export function CTASection() {
	return (
		<Section size="narrow">
			<div className="rounded-[40px] bg-muted px-6 py-16 md:px-12 md:py-20">
				<div className="mb-8 flex justify-center">
					<span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 font-semibold text-primary text-sm">
						<Sparkles className="h-4 w-4" />
						Start Listening
					</span>
				</div>

				<h2 className="mb-6 text-center font-bold text-3xl text-foreground tracking-tight md:text-4xl lg:text-5xl">
					Ready to capture <span className="text-primary">better insights</span>
					?
				</h2>

				<p className="mb-10 text-center text-lg text-muted-foreground md:text-xl">
					Join 10,000+ companies already using Handshake to understand their
					customers better
				</p>

				<div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
					<Button size="lg" className="px-8">
						Create Free Survey
					</Button>
					<Button size="lg" variant="outline" className="px-8">
						Book a Demo
					</Button>
				</div>

				<div className="flex flex-wrap justify-center gap-8 md:gap-12">
					<div className="flex items-center gap-2 text-muted-foreground">
						<ShieldCheck className="h-5 w-5 text-primary" />
						<span className="font-medium text-sm">GDPR Compliant</span>
					</div>
					<div className="flex items-center gap-2 text-muted-foreground">
						<CreditCard className="h-5 w-5 text-primary" />
						<span className="font-medium text-sm">No card required</span>
					</div>
					<div className="flex items-center gap-2 text-muted-foreground">
						<UserPlus className="h-5 w-5 text-primary" />
						<span className="font-medium text-sm">Unlimited seats</span>
					</div>
				</div>
			</div>
		</Section>
	);
}
