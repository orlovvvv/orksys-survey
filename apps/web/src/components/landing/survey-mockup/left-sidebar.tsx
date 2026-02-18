import { ListChecks, Smile, Star, Type } from "lucide-react";

import { QuestionTypeItem, StructureItem } from "./primitives";

export function SurveyMockupLeftSidebar() {
	return (
		<div className="hidden h-full w-64 flex-col overflow-y-auto border-neutral-100 border-r bg-white lg:flex">
			<div className="p-4">
				<h3 className="mb-4 font-bold font-sans text-[10px] text-neutral-900 uppercase tracking-widest">
					Question Types
				</h3>
				<div className="space-y-2">
					<QuestionTypeItem icon={Star} label="Rating Scale" isActive />
					<QuestionTypeItem icon={Type} label="Short Text" />
					<QuestionTypeItem icon={ListChecks} label="Multiple Choice" />
					<QuestionTypeItem icon={Smile} label="NPS" />
				</div>

				<h3 className="mt-8 mb-4 font-bold font-sans text-[10px] text-neutral-900 uppercase tracking-widest">
					Structure
				</h3>
				<div className="space-y-2">
					<StructureItem number={1} label="Welcome Screen" />
					<StructureItem number={2} label="Product Rating" isActive />
					<StructureItem number={3} label="Feature Request" />
					<StructureItem number={4} label="Thank You" />
				</div>
			</div>
		</div>
	);
}
