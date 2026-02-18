import { Handshake, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { Section } from "./ui";

export function Footer() {
	return (
		<Section size="default" className="!py-0 !pb-6">
			<div className="rounded-[40px] bg-neutral-950 px-6 py-16 md:px-12 md:py-20">
				<div className="grid gap-12 lg:grid-cols-2">
					{/* Left Column - Brand & Newsletter */}
					<div className="space-y-8">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
								<Handshake className="h-6 w-6 text-white" />
							</div>
							<span className="font-bold text-white text-xl">Handshake</span>
						</div>

						<p className="max-w-md text-neutral-400">
							Create beautiful, effective surveys in minutes. Understand your
							customers better and make data-driven decisions.
						</p>

						<div className="space-y-3">
							<label
								htmlFor="newsletter"
								className="font-medium text-neutral-300 text-sm"
							>
								Subscribe to our newsletter
							</label>
							<div className="flex gap-2">
								<Input
									id="newsletter"
									type="email"
									placeholder="Enter your email"
									className="border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-500"
								/>
								<Button
									type="submit"
									size="icon"
									className="shrink-0 bg-primary hover:bg-primary/90"
								>
									<Mail className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					{/* Right Column - Links */}
					<div className="grid gap-8 sm:grid-cols-3">
						<div>
							<h4 className="mb-4 font-semibold text-white">Product</h4>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className="text-neutral-400 transition-colors hover:text-white"
									>
										Survey Builder
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-neutral-400 transition-colors hover:text-white"
									>
										Analytics
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-neutral-400 transition-colors hover:text-white"
									>
										Integrations
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-neutral-400 transition-colors hover:text-white"
									>
										Enterprise
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="mb-4 font-semibold text-white">Resources</h4>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className="text-neutral-400 transition-colors hover:text-white"
									>
										Templates
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-neutral-400 transition-colors hover:text-white"
									>
										Blog
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-neutral-400 transition-colors hover:text-white"
									>
										Case Studies
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-neutral-400 transition-colors hover:text-white"
									>
										Help Center
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="mb-4 font-semibold text-white">Social</h4>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className="text-neutral-400 transition-colors hover:text-white"
									>
										Twitter
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-neutral-400 transition-colors hover:text-white"
									>
										LinkedIn
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-neutral-400 transition-colors hover:text-white"
									>
										GitHub
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="mt-12 border-neutral-800 border-t pt-8">
					<div className="flex flex-col flex-wrap justify-between gap-4 sm:flex-row sm:items-center">
						<p className="text-neutral-500 text-sm">
							© 2025 Handshake. All rights reserved.
						</p>
						<div className="flex gap-6">
							<a
								href="#"
								className="text-neutral-500 text-sm transition-colors hover:text-neutral-400"
							>
								Privacy Policy
							</a>
							<a
								href="#"
								className="text-neutral-500 text-sm transition-colors hover:text-neutral-400"
							>
								Terms of Service
							</a>
							<a
								href="#"
								className="text-neutral-500 text-sm transition-colors hover:text-neutral-400"
							>
								Cookie Policy
							</a>
						</div>
					</div>
				</div>
			</div>
		</Section>
	);
}
