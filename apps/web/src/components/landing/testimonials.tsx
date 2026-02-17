import { Quote, Star } from "lucide-react";
import Image from "next/image";

export function Testimonials() {
	return (
		<section className="px-6 py-24 md:px-12 lg:px-24">
			<div className="mx-auto max-w-7xl">
				<div className="mb-16 text-center">
					<h2 className="mb-4 font-bold text-4xl text-neutral-900 tracking-tight md:text-5xl">
						Loved by teams worldwide
					</h2>
					<p className="text-lg text-neutral-600">
						Join thousands of companies creating better surveys with Handshake
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-3">
					{/* Left Card */}
					<div className="rounded-[32px] bg-neutral-50 p-8 shadow-sm">
						<div className="mb-6 flex gap-1">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className="h-5 w-5 fill-violet-500 text-violet-500"
								/>
							))}
						</div>
						<blockquote className="mb-6 text-lg text-neutral-700 leading-relaxed">
							"Handshake helped us pinpoint exactly where users were dropping
							off. We increased our conversion rate by 34% in just two months."
						</blockquote>
						<div className="flex items-center gap-4">
							<div className="relative h-12 w-12 overflow-hidden rounded-full">
								<Image
									src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
									alt="Sarah Jenkins"
									width={48}
									height={48}
									className="object-cover"
								/>
							</div>
							<div>
								<p className="font-semibold text-neutral-900">Sarah Jenkins</p>
								<p className="text-neutral-600 text-sm">PM at TechFlow</p>
							</div>
						</div>
					</div>

					{/* Center Card - Featured */}
					<div className="rounded-[32px] bg-gradient-to-br from-violet-600 to-violet-500 p-8 shadow-lg">
						<div className="mb-6 flex justify-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
								<Quote className="h-6 w-6 text-white" />
							</div>
						</div>
						<blockquote className="mb-6 text-center font-medium text-lg text-white leading-relaxed">
							"The template library is incredible. We launched our first
							customer survey in under 10 minutes. The AI suggestions make it
							feel like we have a research team on demand."
						</blockquote>
						<div className="flex items-center justify-center gap-4">
							<div className="relative h-12 w-12 overflow-hidden rounded-full">
								<Image
									src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
									alt="David Chang"
									width={48}
									height={48}
									className="object-cover"
								/>
							</div>
							<div>
								<p className="font-semibold text-white">David Chang</p>
								<p className="text-sm text-white/80">Founder at Base</p>
							</div>
						</div>
					</div>

					{/* Right Card */}
					<div className="rounded-[32px] bg-neutral-50 p-8 shadow-sm">
						<div className="mb-6 flex gap-1">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className="h-5 w-5 fill-violet-500 text-violet-500"
								/>
							))}
						</div>
						<blockquote className="mb-6 text-lg text-neutral-700 leading-relaxed">
							"The analytics dashboard gives us insights we never had before. We
							can now track customer sentiment in real-time and respond
							instantly to issues."
						</blockquote>
						<div className="flex items-center gap-4">
							<div className="relative h-12 w-12 overflow-hidden rounded-full">
								<Image
									src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
									alt="Elena Rodriguez"
									width={48}
									height={48}
									className="object-cover"
								/>
							</div>
							<div>
								<p className="font-semibold text-neutral-900">
									Elena Rodriguez
								</p>
								<p className="text-neutral-600 text-sm">
									Head of CX at Stellar
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
