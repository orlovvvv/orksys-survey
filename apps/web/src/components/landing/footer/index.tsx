import { Section } from "../ui";
import { BrandSection } from "./brand-section";
import { footerLinkGroups, legalLinks } from "./config";
import { LegalSection } from "./legal-section";
import { LinkGroupComponent } from "./link-group";
import { NewsletterSection } from "./newsletter-section";

export function Footer() {
	return (
		<Section size="default" className="!py-0 !pb-6">
			<div className="rounded-[40px] bg-zinc-900 px-6 py-16 md:px-12 md:py-20">
				<div className="grid gap-12 lg:grid-cols-2">
					{/* Left Column - Brand & Newsletter */}
					<div className="space-y-8">
						<BrandSection />
						<NewsletterSection />
					</div>

					{/* Right Column - Links */}
					<div className="grid gap-8 sm:grid-cols-3">
						{footerLinkGroups.map((group) => (
							<LinkGroupComponent key={group.title} group={group} />
						))}
					</div>
				</div>

				<LegalSection links={legalLinks} />
			</div>
		</Section>
	);
}
