import {
	Bolt,
	Code,
	GitBranch,
	ListChecks,
	MoreHorizontal,
	Plus,
	Send,
	Settings,
	Smile,
	Star,
	Type,
} from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

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
			<div className="flex h-[750px] flex-col">
				<SurveyMockup.Header />
				<div className="flex flex-1 overflow-hidden">
					<SurveyMockup.LeftSidebar />
					<SurveyMockup.CenterCanvas />
					<SurveyMockup.RightSidebar />
				</div>
			</div>
		</div>
	);
}

SurveyMockup.Header = function SurveyMockupHeader() {
	return (
		<header className="z-20 flex shrink-0 items-center justify-between border-neutral-100 border-b bg-white px-6 py-3">
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2 font-sans font-semibold text-neutral-900 text-sm">
					<span className="text-neutral-400">My Workspace /</span>
					<span>Product Feedback Q1</span>
				</div>
			</div>

			<div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
				<button className="rounded-md bg-white px-4 py-1.5 font-sans font-semibold text-neutral-900 text-xs shadow-sm">
					Build
				</button>
				<button className="px-4 py-1.5 font-sans font-semibold text-neutral-500 text-xs hover:text-neutral-900">
					Design
				</button>
				<button className="px-4 py-1.5 font-sans font-semibold text-neutral-500 text-xs hover:text-neutral-900">
					Share
				</button>
				<button className="px-4 py-1.5 font-sans font-semibold text-neutral-500 text-xs hover:text-neutral-900">
					Results
				</button>
			</div>

			<div className="flex items-center gap-3">
				<div className="flex -space-x-2">
					<div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-pink-100 font-bold text-[10px] text-pink-600">
						JD
					</div>
					<div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-100 font-bold text-[10px] text-blue-600">
						AS
					</div>
				</div>
				<button
					type="button"
					className="inline-flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2 font-sans font-semibold text-white text-xs shadow-orange-500/20 shadow-sm transition-all hover:bg-violet-600"
				>
					Publish
					<Send className="h-4 w-4" />
				</button>
			</div>
		</header>
	);
};

SurveyMockup.LeftSidebar = function SurveyMockupLeftSidebar() {
	return (
		<div className="flex h-full w-64 flex-col overflow-y-auto border-neutral-100 border-r bg-white">
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
};

function QuestionTypeItem({
	icon: Icon,
	label,
	isActive = false,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	isActive?: boolean;
}) {
	return (
		<div
			className={cn(
				"group flex cursor-move items-center gap-3 rounded-xl border p-3 transition-colors",
				isActive
					? "border-violet-500/20 bg-violet-50"
					: "border-transparent bg-white hover:border-neutral-200 hover:bg-neutral-50",
			)}
		>
			<Icon
				className={cn(
					"h-5 w-5 text-neutral-400 transition-colors",
					isActive && "group-hover:text-violet-500",
				)}
			/>
			<span className="font-medium text-neutral-700 text-sm">{label}</span>
		</div>
	);
}

function StructureItem({
	number,
	label,
	isActive = false,
}: {
	number: number;
	label: string;
	isActive?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex items-center justify-between rounded-lg p-2 font-medium text-sm transition-colors",
				isActive
					? "border border-violet-500/20 bg-violet-50 text-neutral-900"
					: "text-neutral-600 hover:bg-neutral-50",
			)}
		>
			<div className="flex items-center gap-2">
				<div
					className={cn(
						"flex h-5 w-5 items-center justify-center rounded text-[10px]",
						isActive
							? "bg-violet-500 text-white"
							: number === 1
								? "bg-green-100 text-green-600"
								: "bg-neutral-200 text-neutral-600",
					)}
				>
					{number}
				</div>
				<span>{label}</span>
			</div>
			{isActive && <MoreHorizontal className="h-4 w-4 text-neutral-400" />}
		</div>
	);
}

SurveyMockup.CenterCanvas = function SurveyMockupCenterCanvas() {
	return (
		<div className="relative flex flex-1 items-center overflow-y-auto bg-neutral-50/50 px-8 py-10">
			{/* Survey Card */}
			<div className="relative w-full max-w-[600px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-neutral-200/50 shadow-xl">
				{/* Progress Bar */}
				<div className="h-1.5 w-full bg-neutral-100">
					<div className="h-full w-[40%] rounded-r-full bg-violet-500" />
				</div>

				<div className="p-10">
					<div className="mb-8">
						<span className="mb-2 block font-bold text-[10px] text-violet-500 uppercase tracking-widest">
							Question 2 of 4
						</span>
						<h2 className="font-display font-semibold text-2xl text-neutral-900 leading-tight">
							How likely are you to recommend Handshake to a colleague or
							friend?
						</h2>
						<p className="mt-2 text-neutral-500 text-sm">
							Your feedback helps us improve the platform.
						</p>
					</div>

					{/* Interactive NPS Scale Mockup */}
					<div className="mb-4 flex justify-between gap-1">
						{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
							<button
								key={num}
								type="button"
								className={cn(
									"h-10 w-10 rounded-lg border font-semibold text-sm transition-all",
									num === 9
										? "scale-105 transform border-violet-500 bg-violet-500 text-white shadow-lg shadow-violet-500/30"
										: "border-neutral-200 text-neutral-600 hover:border-violet-500 hover:bg-violet-50 hover:text-violet-500",
								)}
							>
								{num}
							</button>
						))}
					</div>
					<div className="flex justify-between font-medium text-neutral-400 text-xs uppercase tracking-wide">
						<span>Not likely</span>
						<span>Extremely likely</span>
					</div>

					<div className="mt-8 flex justify-between border-neutral-100 border-t pt-8">
						<span className="text-neutral-400 text-xs">
							Powered by <strong>Handshake</strong>
						</span>
						<button
							type="button"
							className="rounded-lg bg-neutral-900 px-6 py-2.5 font-semibold text-sm text-white transition-colors hover:bg-neutral-800"
						>
							Next Question
						</button>
					</div>
				</div>
			</div>

			{/* Logic Visualization Overlay */}
			<div className="absolute top-20 right-4 z-10 w-48 rounded-xl border border-neutral-200 bg-white p-3 shadow-lg">
				<div className="mb-2 flex items-center gap-2">
					<GitBranch className="h-4 w-4 text-violet-500" />
					<span className="font-bold text-neutral-900 text-xs uppercase">
						Logic Flow
					</span>
				</div>
				<div className="space-y-2 text-[10px] text-neutral-500">
					<div className="flex items-center gap-2">
						<div className="h-1.5 w-1.5 rounded-full bg-green-500" />
						<span>If score &gt; 8 → "Review"</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="h-1.5 w-1.5 rounded-full bg-red-500" />
						<span>If score &lt; 6 → "Support"</span>
					</div>
				</div>
			</div>
		</div>
	);
};

SurveyMockup.RightSidebar = function SurveyMockupRightSidebar() {
	return (
		<div className="flex h-full w-72 flex-col border-neutral-100 border-l bg-white">
			<div className="border-neutral-100 border-b p-4">
				<div className="flex items-center justify-between">
					<h3 className="font-bold font-sans text-[10px] text-neutral-900 uppercase tracking-widest">
						Settings
					</h3>
					<Settings className="h-4 w-4 text-neutral-400" />
				</div>
			</div>
			<div className="space-y-6 overflow-y-auto p-5">
				{/* Toggle */}
				<div className="flex items-center justify-between">
					<div className="flex flex-col">
						<span className="font-semibold text-neutral-900 text-sm">
							Required
						</span>
						<span className="text-neutral-400 text-xs">
							Respondents must answer
						</span>
					</div>
					<label className="relative inline-flex cursor-pointer items-center">
						<input
							type="checkbox"
							defaultChecked
							className="peer sr-only"
							readOnly
						/>
						<div className="h-5 w-9 rounded-full bg-neutral-200 after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-violet-500 peer-checked:after:translate-x-full" />
					</label>
				</div>

				{/* Input */}
				<div className="space-y-2">
					<label className="font-semibold text-neutral-700 text-xs uppercase tracking-wide">
						Variable Name
					</label>
					<div className="relative">
						<input
							type="text"
							defaultValue="nps_score_q1"
							className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-neutral-900 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
							readOnly
						/>
						<Code className="absolute top-2.5 right-3 h-[14px] w-[14px] text-neutral-400" />
					</div>
				</div>

				{/* Logic */}
				<div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
					<div className="mb-3 flex items-center gap-2">
						<Bolt className="h-4 w-4 text-violet-500" />
						<span className="font-semibold text-neutral-900 text-sm">
							Skip Logic
						</span>
					</div>
					<p className="mb-3 text-neutral-600 text-xs leading-relaxed">
						Customize user paths based on responses.
					</p>
					<button
						type="button"
						className="w-full rounded-lg border border-violet-200 bg-white py-2 font-semibold text-violet-500 text-xs transition-colors hover:bg-violet-50"
					>
						Add Rule
					</button>
				</div>

				{/* Design */}
				<div className="space-y-3 border-neutral-100 border-t pt-4">
					<label className="font-semibold text-neutral-700 text-xs uppercase tracking-wide">
						Appearance
					</label>
					<div className="flex gap-2">
						<button
							type="button"
							className="h-8 w-8 rounded-full bg-violet-500 ring-2 ring-neutral-200 ring-offset-2"
							aria-label="Violet color"
						/>
						<button
							type="button"
							className="h-8 w-8 rounded-full bg-blue-500"
							aria-label="Blue color"
						/>
						<button
							type="button"
							className="h-8 w-8 rounded-full bg-neutral-900"
							aria-label="Dark color"
						/>
						<button
							type="button"
							className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200"
							aria-label="Custom color"
						>
							<Plus className="h-4 w-4 text-neutral-400" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
