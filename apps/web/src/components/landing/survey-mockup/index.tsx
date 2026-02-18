import { cn } from "@/lib/utils";

import { SurveyMockupCenterCanvas } from "./center-canvas";
import { SurveyMockupHeader } from "./header";
import { SurveyMockupLeftSidebar } from "./left-sidebar";
import { SurveyMockupRightSidebar } from "./right-sidebar";

/**
 * SurveyMockup - A compound component that renders a detailed survey builder interface mockup
 *
 * This is a visual mockup for the landing page showcasing the survey builder interface.
 * It includes the app header, left sidebar with question types, center canvas with survey card,
 * and right sidebar with properties panel.
 */

export function SurveyMockup({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-2xl",
				className,
			)}
		>
			<div className="flex min-h-[500px] flex-col lg:h-[750px]">
				<SurveyMockupHeader />
				<div className="flex flex-1 overflow-hidden">
					<SurveyMockupLeftSidebar />
					<SurveyMockupCenterCanvas />
					<SurveyMockupRightSidebar />
				</div>
			</div>
		</div>
	);
}
