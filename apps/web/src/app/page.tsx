import {
	BentoFeatures,
	CoreFeatures,
	CTASection,
	Footer,
	HeroSection,
	Navigation,
	Pricing,
	SocialProof,
	SurveyMockup,
	Testimonials,
} from "@/components/landing";

export default function Home() {
	return (
		<main className="overflow-x-hidden antialiased">
			<Navigation />
			<HeroSection />
			<section className="px-6 py-12 md:px-12 lg:px-24">
				<div className="mx-auto max-w-7xl">
					<SurveyMockup />
					<SocialProof />
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
