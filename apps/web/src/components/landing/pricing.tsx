import { CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";

export function Pricing() {
	return (
		<section className="px-6 py-24 md:px-12 lg:px-24">
			<div className="mx-auto max-w-7xl">
				<div className="mb-16 text-center">
					<h2 className="mb-4 font-bold text-4xl text-neutral-900 tracking-tight md:text-5xl">
						Simple, transparent pricing
					</h2>
					<p className="text-lg text-neutral-600">
						Choose the plan that fits your needs. No hidden fees.
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-3">
					{/* Personal Plan */}
					<div className="rounded-[32px] border border-neutral-200 bg-white p-8 shadow-sm">
						<div className="mb-6">
							<h3 className="mb-2 font-semibold text-neutral-900 text-xl">
								Personal
							</h3>
							<p className="text-neutral-600 text-sm">
								For individuals and small side projects
							</p>
						</div>
						<div className="mb-8">
							<span className="font-bold text-4xl text-neutral-900">$0</span>
							<span className="text-neutral-600">/month</span>
						</div>
						<ul className="mb-8 space-y-4">
							<li className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
								<span className="text-neutral-700">100 Responses/mo</span>
							</li>
							<li className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
								<span className="text-neutral-700">Unlimited Questions</span>
							</li>
							<li className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
								<span className="text-neutral-700">Basic Templates</span>
							</li>
						</ul>
						<Button variant="outline" className="w-full" size="lg">
							Get Started
						</Button>
					</div>

					{/* Growth Plan */}
					<div className="rounded-[32px] border-2 border-violet-500 bg-white p-8 shadow-lg">
						<div className="mb-6">
							<h3 className="mb-2 font-semibold text-neutral-900 text-xl">
								Growth
							</h3>
							<p className="text-neutral-600 text-sm">
								For startups and growing teams
							</p>
						</div>
						<div className="mb-8">
							<span className="font-bold text-4xl text-neutral-900">$29</span>
							<span className="text-neutral-600">/month</span>
						</div>
						<ul className="mb-8 space-y-4">
							<li className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
								<span className="text-neutral-700">5,000 Responses/mo</span>
							</li>
							<li className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
								<span className="text-neutral-700">Logic Jump & Branching</span>
							</li>
							<li className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
								<span className="text-neutral-700">Remove Branding</span>
							</li>
						</ul>
						<Button className="w-full" size="lg">
							Start Free Trial
						</Button>
					</div>

					{/* Business Plan */}
					<div className="rounded-[32px] bg-neutral-950 p-8 shadow-lg">
						<div className="mb-6">
							<h3 className="mb-2 font-semibold text-white text-xl">
								Business
							</h3>
							<p className="text-neutral-400 text-sm">
								For data-driven organizations
							</p>
						</div>
						<div className="mb-8">
							<span className="font-bold text-4xl text-white">$99</span>
							<span className="text-neutral-400">/month</span>
						</div>
						<ul className="mb-8 space-y-4">
							<li className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
								<span className="text-neutral-300">Unlimited Responses</span>
							</li>
							<li className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
								<span className="text-neutral-300">
									Advanced Analytics & Export
								</span>
							</li>
							<li className="flex items-start gap-3">
								<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
								<span className="text-neutral-300">SSO & Custom Domains</span>
							</li>
						</ul>
						<Button
							variant="default"
							className="w-full bg-violet-600 hover:bg-violet-700"
							size="lg"
						>
							Contact Sales
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
