import {
	AnalyticsMockup,
	AudienceMockup,
	LogicFlowMockup,
	TemplatesMockup,
} from "./mockups";

export interface FeatureConfig {
	badge: string;
	title: string;
	description: string;
	mockup: React.ComponentType;
	layout: "vertical" | "horizontal";
}

export const coreFeatures: FeatureConfig[] = [
	{
		badge: "Logic & Branching",
		title: "Personalized paths.",
		description:
			"Create dynamic experiences that adapt based on previous answers, increasing completion rates.",
		mockup: LogicFlowMockup,
		layout: "vertical",
	},
	{
		badge: "Data Visualization",
		title: "Dashboards that enlighten.",
		description:
			"Instant aggregation of responses into clean, exportable charts. Track NPS, CSAT, and CES over time effortlessly.",
		mockup: AnalyticsMockup,
		layout: "horizontal",
	},
	{
		badge: "Audience Management",
		title: "Target the right users.",
		description:
			"Segment your users based on attributes and behavior. Send surveys via email, link, or in-app embed.",
		mockup: AudienceMockup,
		layout: "horizontal",
	},
	{
		badge: "Templates",
		title: "Start in seconds.",
		description:
			"Browse 50+ expert-verified templates for Product Market Fit, CSAT, Onboarding, and more.",
		mockup: TemplatesMockup,
		layout: "vertical",
	},
];
