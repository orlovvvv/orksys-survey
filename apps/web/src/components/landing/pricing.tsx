import { CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";

import { Section } from "./ui";

export function Pricing() {
	return (
		<Section>
			<div className="mb-16 text-center">
				<h2 className="mb-4 font-bold text-4xl text-foreground tracking-tight md:text-5xl">
					Simple, transparent pricing
				</h2>
				<p className="text-lg text-muted-foreground">
					Choose the plan that fits your needs. No hidden fees.
				</p>
			</div>

			<div className="grid gap-8 md:grid-cols-3">
				{/* Personal Plan */}
				<div className="rounded-[32px] border border-border bg-card p-8 shadow-sm">
					<div className="mb-6">
						<h3 className="mb-2 font-semibold text-foreground text-xl">
							Personal
						</h3>
						<p className="text-muted-foreground text-sm">
							For individuals and small side projects
						</p>
					</div>
					<div className="mb-8">
						<span className="font-bold text-4xl text-foreground">$0</span>
						<span className="text-muted-foreground">/month</span>
					</div>
					<ul className="mb-8 space-y-4">
						<li className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
							<span className="text-muted-foreground">100 Responses/mo</span>
						</li>
						<li className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
							<span className="text-muted-foreground">Unlimited Questions</span>
						</li>
						<li className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
							<span className="text-muted-foreground">Basic Templates</span>
						</li>
					</ul>
					<Button variant="outline" className="w-full" size="lg">
						Get Started
					</Button>
				</div>

				{/* Growth Plan */}
				<div className="rounded-[32px] border-2 border-primary bg-card p-8 shadow-lg">
					<div className="mb-6">
						<h3 className="mb-2 font-semibold text-foreground text-xl">
							Growth
						</h3>
						<p className="text-muted-foreground text-sm">
							For startups and growing teams
						</p>
					</div>
					<div className="mb-8">
						<span className="font-bold text-4xl text-foreground">$29</span>
						<span className="text-muted-foreground">/month</span>
					</div>
					<ul className="mb-8 space-y-4">
						<li className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
							<span className="text-muted-foreground">5,000 Responses/mo</span>
						</li>
						<li className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
							<span className="text-muted-foreground">
								Logic Jump & Branching
							</span>
						</li>
						<li className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
							<span className="text-muted-foreground">Remove Branding</span>
						</li>
					</ul>
					<Button className="w-full" size="lg">
						Start Free Trial
					</Button>
				</div>

				{/* Business Plan */}
				<div className="rounded-[32px] bg-foreground p-8 shadow-lg">
					<div className="mb-6">
						<h3 className="mb-2 font-semibold text-background text-xl">
							Business
						</h3>
						<p className="text-background/60 text-sm">
							For data-driven organizations
						</p>
					</div>
					<div className="mb-8">
						<span className="font-bold text-4xl text-background">$99</span>
						<span className="text-background/60">/month</span>
					</div>
					<ul className="mb-8 space-y-4">
						<li className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
							<span className="text-background/80">Unlimited Responses</span>
						</li>
						<li className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
							<span className="text-background/80">
								Advanced Analytics & Export
							</span>
						</li>
						<li className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
							<span className="text-background/80">SSO & Custom Domains</span>
						</li>
					</ul>
					<Button
						variant="default"
						className="w-full bg-primary hover:bg-primary/90"
						size="lg"
					>
						Contact Sales
					</Button>
				</div>
			</div>
		</Section>
	);
}
