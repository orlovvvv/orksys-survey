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
			<div className="mx-auto max-w-7xl px-6">
				<SurveyMockup />
				<SocialProof />
			</div>
			<BentoFeatures />
			<CoreFeatures />
			<Testimonials />
			<Pricing />
			<CTASection />
			<div className="mx-auto max-w-7xl px-6 pb-12">
				<Footer />
			</div>
		</main>
	);
}
