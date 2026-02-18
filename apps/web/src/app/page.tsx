import {
	BentoFeatures,
	CoreFeatures,
	CTASection,
	Footer,
	HeroSection,
	Navigation,
	Pricing,
	SurveyMockup,
	Testimonials,
	ThemeToggle,
} from "@/components/landing";

export default function Home() {
	return (
		<main className="overflow-x-hidden antialiased">
			<div className="fixed top-6 left-1/2 z-50 flex w-full max-w-5xl -translate-x-1/2 items-center justify-center gap-2 px-4">
				<Navigation />
				<ThemeToggle className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
			</div>
			<HeroSection />
			<section className="px-6 py-12 md:px-12 lg:px-24">
				<div className="mx-auto max-w-7xl">
					<SurveyMockup />
				</div>
			</section>
			<BentoFeatures />
			<CoreFeatures />
			<Testimonials />
			<Pricing />
			<CTASection />
			<Footer />
		</main>
	);
}
